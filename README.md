# 🩺 Doctor Appointment Tracker (Real-Time)

A real-time doctor appointment management system built using **React Native and Firebase**, designed to reduce waiting time and improve patient experience through live status tracking.

---

## 🚀 Problem

In traditional clinics:
- Patients wait without knowing their turn
- Doctors cannot efficiently manage queues
- No real-time visibility of appointment status

---

## 💡 Solution

This app provides:
- 📱 Real-time doctor availability
- ⏱ Live appointment status tracking
- 🔔 Instant updates using Firebase

---

## ✨ Features

- 🔐 Authentication (Firebase Auth)
- 👨‍⚕️ Doctor status (Online / Offline)
- 📊 Real-time queue updates
- 📅 Appointment tracking
- 🔄 Live UI updates without refresh

---

## 🏗 Tech Stack

- **Frontend:** React Native (TypeScript)
- **Backend:** Firebase
- **Database:** Firebase Realtime Database / Firestore
- **Authentication:** Firebase Auth

---

## ⚡ Architecture

### 🏗 High-Level Architecture

<img width="1536" height="1024" alt="ArchitectureDiagram" src="https://github.com/user-attachments/assets/b5465feb-0f46-4c04-9fe6-b6117161b70e" />

The system follows a client-driven, real-time architecture where the React Native app directly interacts with Firebase services.

Firebase handles authentication, data storage, and real-time synchronization. Doctor status, appointment queues, and user data are stored in Firestore/Realtime Database. Real-time listeners propagate updates instantly to all connected clients, ensuring low-latency UI synchronization without manual refresh.

- Reduced backend complexity by leveraging Firebase-managed infrastructure
- Firebase acts as:
  - Backend
  - Real-time engine
  - Auth provider

---

## 📸 Screenshots

![Profile_setup_screen](https://github.com/user-attachments/assets/db6bfa2b-1742-49df-9365-fc85c459f6dc)

![Doctor_signup_screen](https://github.com/user-attachments/assets/1eb93d78-ec59-4fdf-891c-0e0fed5cacc4)

![patient_login_screen](https://github.com/user-attachments/assets/5b5c706a-b3d9-4d2a-9a9b-34d636d6800d)

![Doctor_dashboard_screen](https://github.com/user-attachments/assets/aacea072-faa0-4994-8c3f-100cd3a2d16e)

![patient_dashboard_screen](https://github.com/user-attachments/assets/3a0aced5-d799-4a6e-8b39-1b26521c89a8)

---

## 🧠 Engineering Decisions

### Why Firebase?
- Real-time updates without managing WebSockets
- Faster development
- Scalable backend without infra setup

### Real-Time Flow
- Doctor updates status → Firebase
- Firebase pushes update → All users
- UI updates instantly

### Trade-offs
- Firebase provides fast real-time capabilities but limits backend customization compared to a custom Spring Boot service
- Tight coupling with Firebase services may impact future migration flexibility

---

## 🚀 Future Improvements

- Push notifications (FCM)
- Slot-based booking system
- Admin dashboard
- Analytics (doctor load, wait time)

---

## 📌 Key Learnings

- Real-time system design using Firebase
- State synchronization across clients
- Mobile-first architecture

---

⭐ If you like this project, give it a star!
