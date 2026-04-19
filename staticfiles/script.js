// ================= CSRF TOKEN =================
function getCSRFToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}

// ================= DROPDOWN =================
function toggleDropdown() {
    let menu = document.getElementById("dropdown-menu");
    if (!menu) return;
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.onclick = function (e) {
    if (!e.target.closest('.profile-menu')) {
        let menu = document.getElementById("dropdown-menu");
        if (menu) menu.style.display = "none";
    }
};

// ================= SERVICE IMAGE =================
function getServiceImage(name) {
    const n = name.toLowerCase();

    if (n.includes("ac")) return "/static/images/ac_repair.jpg";
    if (n.includes("electric")) return "/static/images/electrician.jpg";
    if (n.includes("plumb")) return "/static/images/plumber.jpg";
    if (n.includes("clean")) return "/static/images/cleaning.webp";

    return "/static/images/home_img.jpg";
}

// ================= LOAD SERVICES =================
function loadServices() {
    fetch('/api/services/', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            let container = document.getElementById('services-container');
            if (!container) return;

            // container.innerHTML = "<h2>Available Services</h2>";

            data.forEach(service => {
                let div = document.createElement('div');

                div.innerHTML = `
                
   <img src="${getServiceImage(service.name)}"
                    style="width:220px;height:140px;object-fit:cover;border-radius:10px;margin-bottom:10px;">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p>Price: ₹${service.price}</p>

                <button onclick="bookService(${service.id})">
                    Book Now
                </button>
                <hr>
            `;

                container.appendChild(div);
            });
        })
        .catch(err => console.error("Services error:", err));
}

// ================= BOOK SERVICE =================
function bookService(serviceId) {

    // ❌ Not logged in → redirect
    if (!window.USER_ROLE) {
        alert("Please login first!");
        window.location.href = "/login/";
        return;
    }

    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];

    fetch('/api/bookings/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            service: serviceId,
            date: date,
            time: time
        })
    })
        .then(async res => {
            if (!res.ok) {
                alert("Booking Failed");
                return;
            }

            alert("✅ Booking Successful!");
            window.location.href = "/bookings/";
        })
        .catch(err => console.error("Booking error:", err));
}

// ================= LOAD USER =================
// function loadUser() {
//     fetch('/api/user/', {
//         credentials: 'include'
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Not logged in");
//             return res.json();
//         })
//         .then(user => {
//             window.USER_ROLE = user.role;

//             let container = document.getElementById('services-container');
//             if (container) container.innerHTML = ""; // clear

//             if (user.role === 'operator') {
//                 loadPendingJobs();   // ✅ only jobs
//             } else {
//                 loadServices();      // ✅ only services
//             }
//         })
//         .catch(() => {
//             window.USER_ROLE = null;
//             loadServices();          // guest
//         });
// }
function loadUser() {
    fetch('/api/user/', {
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) throw new Error("Not logged in");
            return res.json();
        })
        .then(user => {
            window.USER_ROLE = user.role;

            if (user.role === 'operator') {
                loadPendingJobs();
            } else {
                loadServices();
            }
        })
        .catch(() => {
            window.USER_ROLE = null;
            loadServices();
        });
}

// ================= LOAD PENDING JOBS =================
function loadPendingJobs() {
    fetch('/api/operator/pending/', {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {

            let container = document.getElementById('services-container'); // ✅ FIX
            if (!container) return;

            container.innerHTML = "<h2>Available Jobs</h2>";

            if (!data.length) {
                container.innerHTML += "<p>No pending jobs</p>";
                return;
            }

            data.forEach(job => {
                let div = document.createElement('div');

                div.innerHTML = `
             
                <h3>${job.service_name}</h3>
                <p>Date: ${job.date}</p>
                <p>Time: ${job.time}</p>

                <button onclick="acceptJob(${job.id})">
                    Accept Job
                </button>
                <hr>
            `;

                container.appendChild(div);
            });
        })
        .catch(err => console.error(err));
}

// ================= ACCEPT JOB =================
function acceptJob(id) {
    fetch(`/api/bookings/${id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            operator: true,
            status: "assigned"
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("Job Accepted!");
            loadPendingJobs();
        })
        .catch(err => console.error(err));
}

// ================= INIT =================

// ❌ DO NOT call loadServices() here blindly

// ✅ First decide user
loadUser();

// 🔁 Auto refresh only for operator
setInterval(() => {
    if (window.USER_ROLE === "operator") {
        loadPendingJobs();
    }
}, 3000);