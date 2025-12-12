// -------- DEFAULT ADMIN ----------
let users = JSON.parse(localStorage.getItem("users")) || [
    { name: "Admin", email: "admin@gmail.com", password: "admin123", role: "admin" }
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// SAVE TO STORAGE
function save() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- LOGIN ----------
function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let found = users.find(u => u.email === email && u.password === pass);

    if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));

        if (found.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "user.html";
        }
    } else {
        alert("Invalid Login!");
    }
}

// ---------- LOGOUT ----------
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ---------- ADMIN → CREATE USER ----------
function createUser() {
    let name = document.getElementById("newName").value;
    let email = document.getElementById("newEmail").value;
    let pass = document.getElementById("newPass").value;

    users.push({ name, email, password: pass, role: "user" });
    save();

    alert("User Created!");
}

// ---------- ADMIN → ASSIGN TASK ----------
function assignTask() {
    let uid = document.getElementById("userList").value;
    let title = document.getElementById("taskTitle").value;
    let desc = document.getElementById("taskDesc").value;
    let priority = document.getElementById("priority").value;

    tasks.push({
        user: uid,
        title,
        desc,
        priority,
        status: "Pending"
    });

    save();
    alert("Task Assigned!");
}

// ---------- LOAD USERS IN DROPDOWN ----------
if (location.pathname.includes("admin.html")) {
    let list = document.getElementById("userList");
    users.forEach(u => {
        if (u.role === "user") {
            let opt = document.createElement("option");
            opt.value = u.email;
            opt.innerText = u.name;
            list.appendChild(opt);
        }
    });
}

// ---------- USER DASHBOARD ----------
if (location.pathname.includes("user.html")) {
    let current = JSON.parse(localStorage.getItem("currentUser"));
    let container = document.getElementById("taskContainer");

    let myTasks = tasks.filter(t => t.user === current.email);

    myTasks.forEach((t, i) => {
        container.innerHTML += `
            <div class="task-box">
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                <p><b>Priority:</b> ${t.priority}</p>
                <p><b>Status:</b> ${t.status}</p>

                <select onchange="updateStatus(${i}, this.value)">
                    <option ${t.status=='Pending'?'selected':''}>Pending</option>
                    <option ${t.status=='In Progress'?'selected':''}>In Progress</option>
                    <option ${t.status=='Completed'?'selected':''}>Completed</option>
                </select>
            </div>
        `;
    });
}

// ---------- UPDATE TASK STATUS ----------
function updateStatus(index, status) {
    tasks[index].status = status;
    save();
    alert("Status Updated!");
}
