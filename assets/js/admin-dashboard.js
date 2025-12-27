import { auth, db } from "./firebase-app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// ---------------- Admin Verification ----------------
async function verifyAdmin(user) {
    if (!user) return false;
    try {
        const tokenResult = await user.getIdTokenResult();
        console.log("Verifying admin claims for:", user.email);
        return tokenResult.claims.admin === true;
    } catch (err) {
        console.error("Error verifying admin claims:", err);
        return false;
    }
}

auth.onAuthStateChanged(async (user) => {
    const isAdmin = await verifyAdmin(user);
    if (!user || !isAdmin) {
        console.warn("Unauthorized access attempt detected!");
        await signOut(auth);
        window.location.href = "../auth/admin-login.html";
    } else {
        console.log("Admin logged in successfully:", user.email);
    }
});

// ---------------- Logout ----------------
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    console.log("Admin clicked logout");
    await signOut(auth);
    console.log("Admin signed out successfully");
    window.location.href = "../auth/admin-login.html";
});

// ---------------- Add Teacher ----------------
document.getElementById("addTeacherForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const teacherid = document.getElementById("teacherID").value.trim();
    const name = document.getElementById("teacherName").value.trim();
    const department = document.getElementById("teacherDept").value.trim();
    const subject = document.getElementById("teacherSubject").value.trim();
    const email = document.getElementById("teacherEmail").value.trim();

    if (!teacherid || !name || !department || !subject || !email) {
        alert("Please fill all fields");
        console.warn("Add teacher failed: incomplete fields");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "teachers"), {
            teacherid, name, department, subject, email,
            createdAt: new Date().toISOString()
        });
        console.log("Teacher added:", { id: docRef.id, name, email });
        alert(`${name} added successfully!`);
        document.getElementById("addTeacherForm").reset();
        loadTeachers();
    } catch (err) {
        console.error("Error adding teacher:", err.message);
        alert("Error adding teacher: " + err.message);
    }
});

// ---------------- Load Teachers ----------------
const teacherTableBody = document.querySelector("#teacherTable tbody");
const teachersCol = collection(db, "teachers");

async function loadTeachers() {
    if (!teacherTableBody) return;
    teacherTableBody.innerHTML = "";
    console.log("Loading teachers from Firestore...");

    try {
        const snapshot = await getDocs(teachersCol);

        snapshot.forEach(teacherDoc => {
            const data = teacherDoc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.teacherid}</td>
                <td>${data.name}</td>
                <td>${data.department}</td>
                <td>${data.subject}</td>
                <td>
                    <button class="edit-btn" data-id="${teacherDoc.id}">Edit</button>
                    <button class="delete-btn" data-id="${teacherDoc.id}">Delete</button>
                </td>
            `;
            teacherTableBody.appendChild(row);
        });

        attachTeacherActions();
        console.log(`Loaded ${snapshot.size} teachers`);
    } catch (err) {
        console.error("Error loading teachers:", err.message);
    }
}

// ---------------- Teacher Actions ----------------
function attachTeacherActions() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            if (confirm("Are you sure you want to delete this teacher?")) {
                try {
                    await deleteDoc(doc(db, "teachers", id));
                    console.log("Deleted teacher ID:", id);
                    alert("Teacher deleted!");
                    loadTeachers();
                } catch (err) {
                    console.error("Error deleting teacher:", err.message);
                    alert("Failed to delete teacher: " + err.message);
                }
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const teacherRef = doc(db, "teachers", id);

            const newName = prompt("Enter new name:");
            const newDept = prompt("Enter new department:");
            const newSubject = prompt("Enter new subject:");

            if (newName && newDept && newSubject) {
                try {
                    await updateDoc(teacherRef, {
                        name: newName,
                        department: newDept,
                        subject: newSubject
                    });
                    console.log("Updated teacher ID:", id, { newName, newDept, newSubject });
                    alert("Teacher updated!");
                    loadTeachers();
                } catch (err) {
                    console.error("Error updating teacher:", err.message);
                    alert("Failed to update teacher: " + err.message);
                }
            } else {
                console.warn("Teacher update cancelled");
                alert("Update cancelled. All fields required.");
            }
        });
    });
}

// ---------------- Load Students ----------------
const studentTableBody = document.querySelector("#studentTable tbody");
const studentsCol = collection(db, "students");

async function loadStudents() {
    if (!studentTableBody) return;
    studentTableBody.innerHTML = "";
    console.log("Loading students from Firestore...");

    try {
        const snapshot = await getDocs(studentsCol);

        snapshot.forEach(studentDoc => {
            const data = studentDoc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.status || "Pending"}</td>
                <td>
                    <button class="approve-btn" data-id="${studentDoc.id}">Approve</button>
                    <button class="reject-btn" data-id="${studentDoc.id}">Reject</button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });

        attachStudentActions();
        console.log(`Loaded ${snapshot.size} students`);
    } catch (err) {
        console.error("Error loading students:", err.message);
    }
}

// ---------------- Student Actions ----------------
function attachStudentActions() {
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            try {
                await updateDoc(doc(db, "students", id), { status: "Approved" });
                console.log("Student approved ID:", id);
                alert("Student approved!");
                loadStudents();
            } catch (err) {
                console.error("Error approving student:", err.message);
                alert("Failed to approve student: " + err.message);
            }
        });
    });

    document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            try {
                await updateDoc(doc(db, "students", id), { status: "Rejected" });
                console.log("Student rejected ID:", id);
                alert("Student rejected!");
                loadStudents();
            } catch (err) {
                console.error("Error rejecting student:", err.message);
                alert("Failed to reject student: " + err.message);
            }
        });
    });
}

// ---------------- Initial Load ----------------
loadTeachers();
loadStudents();
