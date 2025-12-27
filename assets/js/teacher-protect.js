// ------------------- TEACHER PROTECT PAGE -------------------

export function checkTeacherLogin() {
    const t = localStorage.getItem("isTeacher");

    if (t !== "true") {
        window.location.href = "../auth/teacher-login.html";
    }
}

// ------------------- TEACHER LOGOUT -------------------

export function teacherLogout() {
    localStorage.removeItem("isTeacher");
    window.location.href = "../auth/teacher-login.html";
}
