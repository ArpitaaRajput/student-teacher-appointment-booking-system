import { auth } from "./firebase-app.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    let loggingOut = false; // Flag to track logout

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            loggingOut = true; // Set flag before signing out
            await signOut(auth);
            localStorage.removeItem("isAdmin");
            window.location.href = "../auth/admin-login.html";
        });
    }

    // Check Firebase session
    onAuthStateChanged(auth, async (user) => {
        if (!user && !loggingOut) {
            alert("Access Denied! Please login as admin.");
            window.location.href = "../auth/admin-login.html";
        } else if (user) {
            try {
                // Get ID token result to check custom claims
                const tokenResult = await user.getIdTokenResult();

                // Check if user has admin claim
                if (!tokenResult.claims.admin) {
                    alert("Access Denied! You are not an admin.");
                    await signOut(auth);
                    window.location.href = "../auth/admin-login.html";
                }
            } catch (err) {
                console.error("Error verifying admin claims:", err);
                alert("Access Denied! Please login as admin.");
                await signOut(auth);
                window.location.href = "../auth/admin-login.html";
            }
        }
    });

});
