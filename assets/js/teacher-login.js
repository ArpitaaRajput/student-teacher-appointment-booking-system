import { auth } from "./firebase-app.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const btn = document.getElementById("loginBtn");

btn.addEventListener("click", () => {

    const email = document.getElementById("teacherEmail").value;
    const password = document.getElementById("teacherPassword").value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {

        // Save teacher login session
        localStorage.setItem("isTeacher", "true");
        localStorage.setItem("teacherEmail", email);

        window.location.href = "../dashboards/teacher-dashboard.html";
    })
    .catch((err) => {
        document.getElementById("teacherErrorMsg").innerText = err.message;
    });

});
