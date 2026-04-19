from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer


# ---------------- CHECK AUTH ----------------
@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    return Response({
        'isAuthenticated': request.user.is_authenticated
    })


# ---------------- BOOKINGS LIST + CREATE ----------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bookings_list_create(request):
    user = request.user

    # -------- GET BOOKINGS --------
    if request.method == 'GET':

        if user.role == 'customer':
            bookings = Booking.objects.filter(user=user)

        elif user.role == 'operator':
            bookings = Booking.objects.filter(operator=user)

        else:
            bookings = Booking.objects.none()

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    # -------- CREATE BOOKING --------
    elif request.method == 'POST':
        serializer = BookingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- UPDATE BOOKING ----------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_booking(request, pk):

    try:
        booking = Booking.objects.get(id=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)

    user = request.user
    data = request.data

    # 🔐 SECURITY CHECKS
    if user.role == 'customer' and booking.user != user:
        return Response({'error': 'Not allowed'}, status=403)

    if user.role == 'operator' and booking.operator not in [None, user]:
        return Response({'error': 'Not allowed'}, status=403)

    # -------- OPERATOR ACCEPT JOB --------
    if 'operator' in data:
        if user.role not in ['operator', 'admin']:
            return Response({'error': 'Only operator can accept job'}, status=403)

        booking.operator = user
        booking.status = 'assigned'

    # -------- UPDATE STATUS --------
    if 'status' in data:
        if user.role != 'operator':
            return Response({'error': 'Only operator can update status'}, status=403)

        booking.status = data['status']

    booking.save()

    serializer = BookingSerializer(booking)
    return Response(serializer.data)


# ---------------- OPERATOR ASSIGNED BOOKINGS ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def operator_bookings(request):
    bookings = Booking.objects.filter(operator=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ---------------- PENDING BOOKINGS (FOR OPERATORS) ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_bookings(request):
    bookings = Booking.objects.filter(status='pending', operator__isnull=True)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)