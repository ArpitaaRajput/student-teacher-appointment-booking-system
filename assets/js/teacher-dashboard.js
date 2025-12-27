import { auth, db } from "./firebase-app.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

let currentUser = null;
let currentTeacherId = null;

// DOM Elements
const logoutBtn = document.getElementById("logoutBtn");
const appointmentsTableBody = document.getElementById("appointmentsTableBody");
const studentTableBody = document.querySelector("#studentTable tbody");
const addAppointmentBtn = document.getElementById("addAppointmentBtn");
const scheduleMsg = document.getElementById("scheduleMsg");

const studentNameInput = document.getElementById("studentNameInput");
const dateTimeInput = document.getElementById("dateTimeInput");
const reasonInput = document.getElementById("reasonInput");


// ---------------- AUTH CHECK ----------------
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log("Auth failed — no teacher logged in.");
        window.location.href = "../auth/teacher-login.html";
        return;
    }

    currentUser = user;
    console.log("Teacher logged in:", currentUser.email);

    try {
        const q = query(collection(db, "teachers"), where("email", "==", user.email));
        const snap = await getDocs(q);

        if (snap.empty) {
            console.error("Teacher profile not found in Firestore.");
            alert("Teacher profile not found.");
            return;
        }

        snap.forEach(docSnap => currentTeacherId = docSnap.data().teacherid);
        console.log("Teacher ID:", currentTeacherId);

        loadAllAppointments();
        loadStudentAppointments();
        loadMessages();

    } catch (err) {
        console.error("Error loading teacher profile:", err);
    }
});


// ---------------- LOGOUT ----------------
logoutBtn.addEventListener("click", async () => {
    console.log("Teacher clicked logout.");
    try {
        await signOut(auth);
        console.log("Logout successful.");
        window.location.href = "../auth/teacher-login.html";
    } catch (err) {
        console.error("Logout failed:", err);
    }
});


// ---------------- ADD NEW APPOINTMENT ----------------
addAppointmentBtn.addEventListener("click", async () => {
    console.log("Add appointment clicked.");

    const studentName = studentNameInput.value.trim();
    const dateTime = dateTimeInput.value;
    const reason = reasonInput.value.trim();

    if (!studentName || !dateTime || !reason) {
        scheduleMsg.textContent = "Please fill all fields.";
        scheduleMsg.style.color = "red";
        console.log("Add appointment failed — missing fields.");
        return;
    }

    try {
        await addDoc(collection(db, "appointments"), {
            teacherId: currentTeacherId,
            teacherEmail: currentUser.email,
            studentName,
            date: dateTime.split("T")[0],
            time: dateTime.split("T")[1] || "",
            reason,
            status: "Approved",
            source: "teacher",
            createdAt: new Date().toISOString()
        });

        console.log("Appointment created:", studentName, dateTime);

        scheduleMsg.textContent = "Appointment scheduled successfully!";
        scheduleMsg.style.color = "green";

        studentNameInput.value = "";
        dateTimeInput.value = "";
        reasonInput.value = "";

        loadAllAppointments();

    } catch (err) {
        console.error("Error scheduling appointment:", err);
        scheduleMsg.textContent = "Error scheduling appointment.";
        scheduleMsg.style.color = "red";
    }
});


// ---------------- LOAD ALL APPOINTMENTS ----------------
async function loadAllAppointments() {
    console.log("Loading all appointments...");

    appointmentsTableBody.innerHTML = "";

    try {
        const q = query(collection(db, "appointments"), where("teacherEmail", "==", currentUser.email));
        const snapshot = await getDocs(q);

        console.log("Appointments found:", snapshot.size);

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const row = document.createElement("tr");

            let actions = "-";
            if (data.source === "student" && data.status === "Pending") {
                actions = `
                    <button class="approve-btn" data-id="${docSnap.id}">Approve</button>
                    <button class="reject-btn" data-id="${docSnap.id}">Reject</button>
                `;
            }

            row.innerHTML = `
                <td>${data.studentName}</td>
                <td>${data.date} ${data.time || ""}</td>
                <td>${data.reason}</td>
                <td>${data.source}</td>
                <td>${data.status}</td>
                <td>${actions}</td>
            `;

            appointmentsTableBody.appendChild(row);
        });

        attachApproveRejectListeners();

    } catch (err) {
        console.error("Failed to load appointments:", err);
    }
}


// ---------------- LOAD STUDENT REQUESTS ----------------
async function loadStudentAppointments() {
    console.log("Loading student appointment requests...");

    studentTableBody.innerHTML = "";

    try {
        const q = query(collection(db, "appointments"), where("teacherEmail", "==", currentUser.email));
        const snapshot = await getDocs(q);

        snapshot.forEach(docSnap => {
            const data = docSnap.data();

            if (data.source === "student") {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${data.studentName}</td>
                    <td>${data.date} ${data.time}</td>
                    <td>${data.studentEmail || "-"}</td>
                    <td>${data.status}</td>
                    <td>
                        <button class="approve-btn" data-id="${docSnap.id}">Approve</button>
                        <button class="reject-btn" data-id="${docSnap.id}">Reject</button>
                    </td>
                `;

                studentTableBody.appendChild(row);
            }
        });

        console.log("Student requests loaded.");

        attachApproveRejectListeners();

    } catch (err) {
        console.error("Error loading student requests:", err);
    }
}


// ---------------- APPROVE / REJECT ACTIONS ----------------
function attachApproveRejectListeners() {
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            console.log("Approved appointment:", btn.dataset.id);
            await updateDoc(doc(db, "appointments", btn.dataset.id), { status: "Approved" });
            loadAllAppointments();
            loadStudentAppointments();
        });
    });

    document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            console.log("Rejected appointment:", btn.dataset.id);
            await updateDoc(doc(db, "appointments", btn.dataset.id), { status: "Rejected" });
            loadAllAppointments();
            loadStudentAppointments();
        });
    });
}


// ---------------- LOAD MESSAGES ----------------
const messagesList = document.getElementById("messagesList");

async function loadMessages() {
    console.log("Loading messages...");

    try {
        const q = query(
            collection(db, "messages"),
            where("teacherEmail", "==", currentUser.email),
            orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        messagesList.innerHTML = "";

        snap.forEach(docSnap => {
            const data = docSnap.data();

            const card = document.createElement("div");
            card.className = "message-card";

            card.innerHTML = `
                <div class="meta">${data.studentName} (${data.studentEmail}) • ${new Date(data.createdAt).toLocaleString()}</div>
                <p>${data.message}</p>
            `;

            messagesList.appendChild(card);
        });

        console.log("Messages loaded:", snap.size);

    } catch (err) {
        console.error("Error loading messages:", err);
    }
}
