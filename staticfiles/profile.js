// ================= PROFILE INFO =================
fetch('http://127.0.0.1:8000/api/user/', {
    credentials: 'include'
})
    .then(res => res.json())
    .then(user => {

        let profileDiv = document.getElementById('profile-info');

        profileDiv.innerHTML = `
        <p><b>Username:</b> ${user.username}</p>
        <p><b>Role:</b> ${user.role}</p>
    `;
    });
function toggleDropdown() {
    let menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// ================= COMPLETED BOOKINGS ONLY =================
fetch('http://127.0.0.1:8000/api/bookings/', {
    credentials: 'include'
})
    .then(res => res.json())
    .then(data => {

        let container = document.getElementById('history-container');

        // ✅ FILTER ONLY COMPLETED BOOKINGS
        let completedBookings = data.filter(
            booking => booking.status === 'completed'
        );

        if (!completedBookings.length) {
            container.innerHTML = "<p>No completed bookings yet</p>";
            return;
        }

        completedBookings.forEach(booking => {

            let div = document.createElement('div');

            div.style.background = "white";
            div.style.padding = "15px";
            div.style.margin = "10px 0";
            div.style.borderRadius = "10px";
            div.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";

            div.innerHTML = `
            <h3>${booking.service_name}</h3>

            <p><b>Date:</b> ${booking.date}</p>
            <p><b>Time:</b> ${booking.time}</p>

            <p style="color:green; font-weight:bold;">
                ✅ Completed
            </p>
        `;

            container.appendChild(div);
        });
    });