// student-login.js
import { app, auth, db } from "./firebase-app.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { doc, getDoc, setDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const btn = document.getElementById("loginBtn");
const errorBox = document.getElementById("errorMsg");

btn.addEventListener("click", async () => {
    const email = document.getElementById("studentemail").value.trim();
    const password = document.getElementById("studentpassword").value.trim();
    const name = document.getElementById("studentname").value.trim();

    errorBox.textContent = "";

    if (!email || !password) {
        errorBox.textContent = "Please enter email and password.";
        return;
    }

    if (password.length < 6) {
        errorBox.textContent = "Password must be at least 6 characters.";
        return;
    }

    let userCred;

    try {
        if (name) {
            // Registration
            userCred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "students", userCred.user.uid), {
                email,
                name,
                status: "Pending",
                createdAt: serverTimestamp()
            });
            alert("Registered successfully! Wait for admin approval.");
            await signOut(auth);
            return;
        } else {
            // Login
            userCred = await signInWithEmailAndPassword(auth, email, password);
        }

        // Check Firestore status
        const docSnap = await getDoc(doc(db, "students", userCred.user.uid));
        if (!docSnap.exists()) throw new Error("No student record found.");

        const data = docSnap.data();
        if (data.status === "Rejected") {
            errorBox.textContent = "Your account has been rejected.";
            await signOut(auth);
            return;
        } else if (data.status === "Pending") {
            errorBox.textContent = "Your account is pending approval.";
            await signOut(auth);
            return;
        }

        // Approved → redirect
        window.location.href = "../dashboards/student-dashboard.html";

    } catch (err) {
        console.error(err);
        errorBox.textContent = err.message;
    }
});
