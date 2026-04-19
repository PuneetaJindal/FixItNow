function getCSRFToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}

function toggleDropdown() {
    let menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

const steps = ["pending", "assigned", "in_progress", "completed"];

// ---------------- TIMELINE ----------------
function renderTimeline(currentStatus) {
    if (!currentStatus) currentStatus = "pending";

    let currentIndex = steps.indexOf(currentStatus);
    if (currentIndex === -1) currentIndex = 0;

    return `
        <div class="timeline">
            ${steps.map((step, index) => {
        let state = "";

        if (currentStatus === "completed") {
            state = "done";
        } else {
            if (index < currentIndex) state = "done";
            else if (index === currentIndex) state = "current";
        }

        return `
                    <div class="step ${state}">
                        <div class="circle"></div>
                        <span>${step.replace("_", " ")}</span>
                    </div>
                `;
    }).join("")}
        </div>
    `;
}

// ---------------- LOAD BOOKINGS ----------------
function loadBookings() {
    fetch('/api/bookings/', {
        method: "GET",
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {

            let container = document.getElementById('bookings-container');
            container.innerHTML = "";

            if (!data.length) {
                container.innerHTML = "<p class='empty'>No bookings found</p>";
                return;
            }

            data.forEach(booking => {

                let div = document.createElement('div');

                div.innerHTML = `
                <h3>${booking.service_name}</h3>

                <p><b>Customer:</b> ${booking.user_name}</p>
                <p><b>Operator:</b> ${booking.operator_name || 'NOT Assigned'}</p>

                <p><b>Booked On:</b> ${new Date(booking.created_at).toLocaleDateString()}</p>
                <p><b>Time:</b> ${new Date(booking.created_at).toLocaleTimeString()}</p>

                ${renderTimeline(booking.status)}
            `;

                const isOperator = window.USER_ROLE === "operator";

                // ---------------- OPERATOR BUTTONS ONLY ----------------
                if (isOperator) {

                    if (booking.status === "assigned") {
                        div.innerHTML += `
                        <button class="action-btn start-btn"
                            onclick="updateStatus(${booking.id}, 'in_progress')">
                            ▶ Start Work
                        </button>
                    `;
                    }

                    if (booking.status === "in_progress") {
                        div.innerHTML += `
                        <button class="action-btn start-btn"
                            onclick="updateStatus(${booking.id}, 'completed')">
                            ✔ Complete
                        </button>
                    `;
                    }

                    if (booking.status === "completed") {
                        div.innerHTML += `
                        <p style="color:green; font-weight:bold;">
                            ✅ Service Completed
                        </p>
                    `;
                    }
                }

                container.appendChild(div);
            });
        })
        .catch(err => console.error("Error loading bookings:", err));
}
function loadUser() {
    fetch('/api/user/', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(user => {
            window.USER_ROLE = user.role;

            console.log("USER ROLE:", window.USER_ROLE); // 🔥 debug

            loadBookings(); // IMPORTANT: call AFTER role is set
        })
        .catch(err => console.error(err));
}
// ---------------- UPDATE STATUS ----------------
function updateStatus(id, status) {
    fetch(`/api/bookings/${id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ status: status })
    })
        .then(res => res.json())
        .then(data => {
            console.log("UPDATED:", data);
            alert("Status updated!");
            loadBookings(); // 🔥 no full reload needed
        })
        .catch(err => console.error(err));
}

// ---------------- INIT ----------------
loadUser();

// 🔥 auto refresh for new bookings
setInterval(loadBookings, 5000);