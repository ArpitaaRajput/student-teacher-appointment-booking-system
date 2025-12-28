# 🎓 Student–Teacher Appointment Booking System

A web-based **Student–Teacher Appointment Booking System** developed using **HTML, CSS, JavaScript, and Firebase**.  
This project enables students and teachers to manage appointments efficiently while demonstrating **authentication, role-based access control, and secure database operations** using Firebase.

---

## 🎯 Purpose of the Project

The purpose of this project is to:
- Simplify appointment scheduling between students and teachers
- Eliminate manual appointment handling
- Provide secure role-based dashboards
- Practice real-world frontend development with Firebase backend
- Implement authentication, Firestore rules, and access control
- Build an internship-ready full-stack web application

---

## 🚀 Features

- Role-based login (Admin, Teacher, Student)
- Secure authentication using Firebase
- Separate dashboards for each role
- Appointment booking and management
- Approval and rejection workflow
- Messaging between students and teachers
- Real-time data updates
- Secure logout and session handling
- Responsive and user-friendly UI

---

## 🧩 Modules

### **Admin Module**
- Admin authentication
- Access admin dashboard
- Add, update, and delete teachers
- Approve or reject student registrations
- View all students and teachers
- Monitor all appointments
- Manage system data securely

### **Teacher Module**
- Teacher login
- View appointment requests from students
- Approve or reject appointments
- Create appointments manually
- View assigned appointments
- Receive and read student messages
- Secure logout

### **Student Module**
- Student registration and login
- Search teachers by subject or department
- Book appointments with teachers
- View appointment status (Pending / Approved / Rejected)
- Send messages to teachers
- View personal appointment history
- Secure logout

---

## 🔐 Security

- Firebase Authentication for login and registration
- Role-based access control (Admin, Teacher, Student)
- Firestore security rules to protect sensitive data
- Admin access controlled using Firebase Custom Claims
- Dashboard access restricted without authentication
- Secure session handling and logout

---

## 🗄️ Firestore Collections

- **students**
  - Student personal details
  - Approval status

- **teachers**
  - Teacher details
  - Department and subject information

- **appointments**
  - Appointment date and time
  - Status (Pending / Approved / Rejected)
  - Student and teacher references

- **messages**
  - Student-to-teacher messages
  - Timestamped communication records

---

## 🛠️ Technologies Used

- **HTML** – Page structure  
- **CSS** – Styling and responsive layout  
- **JavaScript** – Application logic and validation  
- **Firebase Authentication** – Secure login and role handling  
- **Firestore Database** – Cloud-based real-time data storage  
- **Netlify** – Project hosting  

---

## 📂 Project Structure

```
student-teacher-appointment-booking/
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── firebase-app.js
│   │   ├── admin-login.js
│   │   ├── admin-dashboard.js
│   │   ├── admin-protect.js
│   │   ├── teacher-dashboard.js
│   │   ├── student-dashboard.js
│   │   └── auth.js
│
├── pages/
│   ├── auth/
│   │   ├── admin-login.html
│   │   ├── teacher-login.html
│   │   └── student-login.html
│   ├── dashboards/
│   │   ├── admin-dashboard.html
│   │   ├── teacher-dashboard.html
│   │   └── student-dashboard.html
│
├── index.html
├── about.html
├── README.md
```
---

## 🔄 Workflow and Execution

The **Student–Teacher Appointment Booking System** follows a structured workflow to ensure secure access and smooth appointment management.

### 1️⃣ Application Initialization
- Application loads the **landing or login page**  
- **Firebase** is initialized using client-side configuration  
- Required **CSS** and **JavaScript** files are loaded  

### 2️⃣ User Authentication
- Users login based on their **role** (Admin, Teacher, Student)  
- **Firebase Authentication** validates credentials  
- Successful login creates a **secure session**  
- Unauthorized access is **blocked**  

### 3️⃣ Role-Based Access Control
- **Admins** access the **Admin Dashboard**  
- **Teachers** access the **Teacher Dashboard**  
- **Students** access the **Student Dashboard**  
- Direct URL access without login is **restricted**  

### 4️⃣ Appointment Management
- **Students** create appointment requests  
- **Teachers** approve or reject appointments  
- **Admins** can view all appointments  
- Appointment status updates in **real time**  

### 5️⃣ Messaging System
- **Students** send messages to teachers  
- **Teachers** can read messages assigned to them  
- Messages are stored securely in **Firestore**  

### 6️⃣ Data Handling with Firestore
- **Firestore** stores users, appointments, and messages  
- CRUD operations follow **role permissions**  
- **Security rules** prevent unauthorized access  

### 7️⃣ Session Management and Logout
- Active sessions are maintained **securely**  
- **Logout** clears session data  
- Users are redirected to **login page**  

### 8️⃣ Error Handling and Validation
- Input validation on **forms**  
- Friendly **error messages** for invalid actions  
- Secure blocking of **unauthorized operations**  

---

### ✅ Execution Summary
- Frontend manages **UI and interactions**  
- **Firebase Authentication** ensures secure access  
- **Firestore** handles structured and real-time data  
- **Security rules** enforce role-based permissions  
- Fully web-based system with **no server setup required**  

---

## 🌐 Live Demo
🔗 Check out the live project here: [Netlify Link] (https://student-teacher-appointment-system.netlify.app/)  

---

## 👩‍💻 Author
**Arpita Rawat**  

---

## 📄 License
This project is developed for **educational and internship purposes only**.  

---

## 📌 Note
This project uses **Firebase services**.  
Sensitive files such as **service account keys** and **environment files** are excluded using `.gitignore`.  
