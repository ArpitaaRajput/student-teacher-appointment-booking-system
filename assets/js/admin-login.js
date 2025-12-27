import { auth } from "./firebase-app.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the ID token result to check custom claims
        const tokenResult = await user.getIdTokenResult();

        // Check if the user has the "admin" claim
        if (!tokenResult.claims.admin) {
            alert("Access denied! Not admin.");
            await auth.signOut();
            return;
        }

        // Redirect to admin dashboard
        window.location.href = "../dashboards/admin-dashboard.html";

    } catch (err) {
        console.error("Login error:", err);
        alert(err.message);
    }
});
