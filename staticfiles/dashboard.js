fetch('http://127.0.0.1:8000/api/user/')
    .then(response => response.json())
    .then(user => {
        let container = document.getElementById('dashboard');
        if (user.role == 'customer') {
            container.innerHTML = `
        <h2>My Bookings</h2>
        <a href="/bookings/">View bookings</a>`;
        }
        else if (user.role === 'operator') {
            container.innerHTML = `<h2>Assigned Jobs</h2>
            <div id="jobs"></div>
            `;
            fetch('http://127.0.0.1:8000/api/operator/bookings/')
                .then(res => res.json())
                .then(data => {
                    let jobsDiv = document.getElementById('jobs');
                    data.forEach(job => {
                        let div = document.createElement('div');
                        div.innerHTML = `
                    <h3>${job.service_name}</h3>
                    <p>Status:${job.status}</p>
                    <button onclick="updateStatus(${job.id},'in_progress')">Start</button>
                      <button onclick="updateStatus(${job.id},'completed')">Complete</button>
                      <hr>
                    `;
                        jobsDiv.Div.appendChild(div);
                    });
                });
        }
        else if (user.role === 'admin') {
            container.innerHTML = `<h2>Admin Panel<h2>
        <a href="/admin/">Go to Admin</a>
        `;
        }
    });
function updateStatus(id, status) {
    fetch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ status: status })
    })
        .then(res => res.json())
        .then(data => {
            alert("status updates!");
            location.reload();
        });
}

