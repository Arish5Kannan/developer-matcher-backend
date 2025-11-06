# 💻 Codemate Backend — Developer Matchmaking Platform

## 🧠 Overview
**Codemate** is a **developer matchmaking platform** designed to help coders find compatible collaborators based on their skills, interests, and goals.  
This backend, built with **Node.js**, **Express**, and **MongoDB**, powers user authentication, intelligent developer matching, and real-time chat between matched users.

---

## 🚀 Features

### 🔐 Authentication
- Secure user registration and login (with password hashing and JWT/session)
- Unique username and email validation
- Token-based authentication for protected routes

### 👤 Developer Profiles
- Create and update your developer profile
- Include:
  - Skills & technologies
  - Experience level
  - GitHub / Portfolio links
  - Collaboration interests
- Fetch public profiles or delete your own

### 🤝 Smart Matchmaking
- Match developers by:
  - Similar tech stacks
  - Geographic proximity (via geolocation)
  - Compatibility using **KNN (Machine Learning)**
- Two matching strategies:
  - Standard Matching
  - ML-based (KNN) Matching

### 💬 Real-Time Chat
- One-on-one messaging between matched developers
- Persistent message storage
- Chat creation and retrieval
