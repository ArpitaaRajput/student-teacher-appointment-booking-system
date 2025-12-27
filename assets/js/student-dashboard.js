import { auth, db } from "./firebase-app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    console.log("Student clicked logout");
    signOut(auth)
        .then(() => {
            console.log("Student logged out successfully");
            window.location.href = "../auth/student-login.html";
        })
        .catch(err => console.error("Logout error:", err));
});

window.searchTeacher = searchTeacher;
window.bookAppointment = bookAppointment;

// Map to store teacherid → teacherEmail
let teachersMap = {};

// Load all teachers once at start
loadTeachers();

async function loadTeachers() {
    try {
        console.log("Loading teachers...");
        const snapshot = await getDocs(collection(db, "teachers"));

        snapshot.forEach(docSnap => {
            const d = docSnap.data();
            teachersMap[d.teacherid] = d.email;
        });

        console.log("Teachers loaded successfully:", teachersMap);
    } catch (err) {
        console.error("Error loading teachers:", err);
    }
}

// -------------------- SEARCH TEACHER ----------------------
async function searchTeacher() {
    const subjectInput = document.getElementById("subjectInput").value.toLowerCase();
    const teacherList = document.getElementById("teacherList");

    console.log("Student searching for teachers with subject:", subjectInput);

    teacherList.innerHTML = "<p>Searching...</p>";

    try {
        const snapshot = await getDocs(collection(db, "teachers"));
        teacherList.innerHTML = "";
        let found = false;

        snapshot.forEach(docSnap => {
            const d = docSnap.data();
            teachersMap[d.teacherid] = d.email; // keep map updated

            if (d.subject.toLowerCase().includes(subjectInput)) {
                found = true;

                console.log("Matching teacher found:", d.teacherid, d.name);

                const card = document.createElement("div");
                card.classList.add("teacher-card");
                card.innerHTML = `
                    <h3>${d.name}</h3>
                    <h5>Teacher ID: ${d.teacherid}</h5>
                    <p>Subject: ${d.subject}</p>
                    <p>Email: ${d.email}</p>
                `;

                teacherList.appendChild(card);
            }
        });

        if (!found) {
            console.warn("No teachers found for subject:", subjectInput);
            teacherList.innerHTML = "<p>No teachers found for this subject.</p>";
        }

    } catch (err) {
        console.error("Search Error:", err);
        teacherList.innerHTML = "<p>Error fetching data.</p>";
    }

    console.log("Teachers map after search:", teachersMap);
}

// -------------------- BOOK APPOINTMENT ----------------------
async function bookAppointment() {
    const teacherId = document.getElementById("teacherIdInput").value.trim();
    const date = document.getElementById("dateInput").value;
    const time = document.getElementById("timeInput").value;
    const msg = document.getElementById("appointmentMsg");

    console.log("Student booking appointment with Teacher ID:", teacherId);

    if (!teacherId || !date || !time) {
        console.warn("Booking failed - missing fields");
        msg.innerHTML = "Please fill all fields.";
        msg.style.color = "red";
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        console.warn("Booking failed - user not logged in");
        msg.innerHTML = "You must be logged in!";
        msg.style.color = "red";
        return;
    }

    const teacherEmail = teachersMap[teacherId];
    if (!teacherEmail) {
        console.error("Teacher ID not found:", teacherId);
        msg.innerHTML = "Teacher ID not found!";
        msg.style.color = "red";
        return;
    }

    try {
        await addDoc(collection(db, "appointments"), {
            teacherId,
            teacherEmail,
            studentUid: user.uid,
            studentName: user.displayName || "Student",
            studentEmail: user.email,
            date,
            time,
            reason: "Appointment Request",
            status: "Pending",
            source: "student",
            createdAt: new Date().toISOString(),
        });

        console.log("Appointment created successfully:", {
            teacherId,
            student: user.uid,
            date,
            time
        });

        msg.innerHTML = "Appointment request sent!";
        msg.style.color = "green";

    } catch (err) {
        console.error("Appointment Error:", err);
        msg.innerHTML = "Error booking appointment.";
        msg.style.color = "red";
    }
}

// -------------------- SEND MESSAGE TO TEACHER ----------------------
const teacherIdMessage = document.getElementById("teacherIdMessage");
const msgInput = document.getElementById("msgInput");
const sendMsgBtn = document.getElementById("sendMsgBtn");
const msgStatus = document.getElementById("msgStatus");

sendMsgBtn.addEventListener("click", async () => {
    const teacherId = teacherIdMessage.value.trim();
    const message = msgInput.value.trim();

    console.log("Student sending message to Teacher ID:", teacherId);

    if (!teacherId || !message) {
        console.warn("Message sending failed - missing fields");
        msgStatus.textContent = "Fill all fields";
        msgStatus.style.color = "red";
        return;
    }

    const teacherEmail = teachersMap[teacherId];
    if (!teacherEmail) {
        console.error("Message failed - Invalid Teacher ID:", teacherId);
        msgStatus.textContent = "Teacher ID not found";
        msgStatus.style.color = "red";
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        console.warn("Message failed - student not logged in");
        msgStatus.textContent = "Login required";
        msgStatus.style.color = "red";
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            teacherId,
            teacherEmail,
            studentUid: user.uid,
            studentName: user.displayName || "Student",
            studentEmail: user.email,
            message,
            createdAt: new Date().toISOString()
        });

        console.log("Message successfully sent:", {
            teacherId,
            student: user.uid,
            message
        });

        msgStatus.textContent = "Message sent!";
        msgStatus.style.color = "green";
        msgInput.value = "";

    } catch (err) {
        console.error("Error sending message:", err);
        msgStatus.textContent = "Error sending message";
        msgStatus.style.color = "red";
    }
});
