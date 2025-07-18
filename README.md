# 🎓 CampusPulse – Smart Campus Assistant

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)

*A modern, AI-powered web platform that centralizes campus updates, events, and announcements while providing students with an intelligent chatbot assistant built using Gemini AI.*

</div>

---

## 📋 Table of Contents

- [🎯 Project Objective](#-project-objective)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Firebase Structure](#️-firebase-structure)
- [🤖 Gemini AI Integration](#-gemini-ai-integration)
- [🚀 Getting Started](#-getting-started)
- [📱 Use Cases](#-use-cases)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [📄 License](#-license)

---

## 🎯 Project Objective

College campuses often face scattered communication challenges – students miss out on important updates, events, and placement notices. **CampusPulse** solves this by:

- 📊 **Centralized Dashboard** - All events and announcements in one place
- 🤖 **AI-Powered Assistant** - Instant campus-related queries with Gemini AI
- 👥 **Role-Based Management** - Admin access for organizers and faculty

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **shadcn/ui** (Component Library)
- **Lucide Icons**
- **Framer Motion** (Animations)

### Authentication & Backend
- **Firebase Authentication** (Google Sign-in)
- **Firebase Firestore** (NoSQL Database)
- **Firebase Storage** (Event Banners/Posters)
- **Firebase Cloud Functions** (Node.js)

### AI Assistant
- **Gemini 1.5 Pro** via Google AI Studio

### Deployment
- **Firebase Hosting** or **Vercel**

---

## ✨ Features

### 🎓 Student Dashboard
- 📅 View upcoming events and recent announcements
- 💬 Interact with CampusBot (AI chatbot) for campus questions
- 🎨 Personalized experience based on login

### 🤖 Gemini Chatbot – CampusBot
Ask questions like:
- *"When is the next hackathon?"*
- *"How to register for GSoC?"*
- *"Who is the placement coordinator?"*

**Features:**
- 🧠 Trained on contextual campus prompts
- ⌨️ Typing animation and markdown-style replies
- ⚡ Quick prompt suggestions

### 🔧 Admin Panel
- 🔐 Role-based access using Firebase custom claims
- ➕ Add or edit events and announcements
- 🖼️ Upload event posters using Firebase Storage

### 🎨 Responsive UI
- 📱 Mobile-first approach
- 🌓 Light/dark mode support
- ✨ Animated cards, buttons, and smooth transitions

---

## 🏗️ Firebase Structure

### Firestore Collections
```
/users
├── Contains basic user info and role
│
/events
├── Event data: title, description, date, time, tags, image URL
│
/announcements
└── Text-based announcements with metadata
```

### Storage Paths
```
/posters/{eventId}
└── Uploaded event poster files
```

---

## 🤖 Gemini AI Integration

Implemented using **Firebase Cloud Functions** that connect to Gemini 1.5 Pro.

### Prompt Example:
```
"You are CampusBot, a helpful AI assistant for [Your College Name]. 
Your job is to help students with event info, campus clubs, 
and academic resources. Keep answers friendly, short, and helpful."
```

CampusBot responds to student queries dynamically and is embedded in the dashboard.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Google AI Studio API key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sakshamjaiswal01/campuspulse
   cd campfeed
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add Firebase config to your `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Deploy to Firebase Hosting** (Optional)
   ```bash
   firebase deploy
   ```

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## 📱 Use Cases

- 🎯 **Student Clubs** - Manage and promote events effectively
- 🎓 **Students** - 24/7 access to campus information and updates
- 🏫 **Educational Institutions** - Central communication system between students, clubs, and faculty

---

## 📸 Screenshots

*Screenshots will be added as the project develops*

---

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Saksham Jaiswal**  
*Full Stack Developer | Open Source Contributor*

[![GitHub](https://img.shields.io/badge/GitHub-Saksham-Jaiswal-2004-black?style=for-the-badge&logo=github)](https://github.com/Saksham-Jaiswal-2004)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Saksham-Jaiswal-2004-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/saksham-jaiswal-220637302)
[![Email](https://img.shields.io/badge/Email-sakshamjaiswalofficial@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:sakshamjaiswalofficial@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Note for Reviewers

*This project was submitted as part of the selection process for **GDG On Campus – July 2025 Cohort**, showcasing leadership, innovation, and technical skill using the Google developer ecosystem.*

**Built with ❤️ for the campus community**

</div>