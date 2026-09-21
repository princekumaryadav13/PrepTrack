# PrepTrack — Placement Preparation Platform

> **Full-Stack Placement Preparation Platform** built with **React.js, Node.js, Express.js, MongoDB, JWT, and Tailwind CSS**.

PrepTrack empowers college students and job candidates to master technical and placement examinations through topic-wise questions, real-time timed mock tests, dynamic performance analytics, weak-area detection, and company-tailored preparation tracking.

---

## 🚀 Key Features

### 1. 📚 Topic-Wise Question Bank (4 Core Sections)
- **Aptitude**: Time & Work, Speed-Distance-Time, Percentages & Interest, Permutations & Combinations, Probability, Profit & Loss.
- **Verbal Ability**: Sentence Correction, Para Jumbles, Reading Comprehension, Synonyms & Antonyms, Idioms & Phrases.
- **Data Structures & Algorithms (DSA)**: Arrays & Two Pointers, Linked Lists, Binary Trees & BSTs, Dynamic Programming, Graphs, Stacks & Queues.
- **Core CS Fundamentals**: Database Management Systems (Normalization, ACID, SQL), Operating Systems (Deadlocks, Process Scheduling, Virtual Memory), Computer Networks (TCP/IP, OSI, HTTP), Object-Oriented Programming (Polymorphism, Inheritance).
- **Interactive Practice Mode**:
  - Live stopwatch timer tracking time taken per question.
  - Radio choice selection with instant evaluation.
  - Comprehensive answer explanation and guidance.
  - Filter by category, topic, difficulty (Easy, Medium, Hard), target recruiter, and keyword search.

### 2. ⏱️ Timed Mock Tests Engine
- **Full Exam Simulation**:
  - Countdown timer with alerts when under 2 minutes.
  - Question Palette navigation grid (1..N) with real-time status indicators (Answered, Marked for Review, Unvisited).
  - Clear response, Mark for review, Next / Previous navigation.
  - Automatic test submission when countdown expires.
  - Manual submission confirmation modal with answer summary.
- **Instant Scorecard & Solution Review**:
  - Score achieved vs total marks, passing mark threshold, pass/fail status.
  - Accuracy percentage and total time taken.
  - Solution Review mode: see candidate's choice vs correct choice with in-depth solution explanation.
  - Past Test Attempts history table.

### 3. 🛡️ Role-Based Access Control (RBAC) & Administrator Portal
- **JWT-Based Authentication**: Secure token generation, verification, and route guards.
- **Student & Admin Roles**:
  - **Student**: Access practice questions, mock tests, company tracking, and personal analytics.
  - **Admin**: Dedicated Management Portal (`/admin`) to manage questions and mock tests.
- **Admin Management Portal**:
  - **Question Management**: Search, filter, Create Question modal with options & explanation, Edit Question, and Delete Question.
  - **Mock Test Management**: Create Timed Mock Test with question selector, edit test details, and delete tests.

### 4. 📊 Performance Analytics & Weak Topic Detection
- Overall metrics: Questions solved, accuracy %, mock tests completed, average test score %, total time spent.
- Category mastery comparison progress bars.
- Automated **Weak Area Detection**: Identifies topics with accuracy < 65% and provides a 1-click **"Drill Topic"** action button.
- **Strong Area Badges**: Topics with $\ge 75\%$ accuracy marked as mastered.
- Topic-by-topic breakdown table with attempt counts and accuracy ratings.

### 5. 🏢 Company-Specific Preparation Tracking & Personalized Recommendations
- **Company Profiles**: Dedicated prep guides for **TCS, Amazon, Infosys, Google, Wipro, Accenture, Microsoft, and Cognizant**.
- **Dynamic Readiness Score**: Dynamically calculated based on the candidate's mastery in the weighted categories for each company (e.g. Amazon: 60% DSA + 25% CS Core + 15% Aptitude; TCS: 40% Aptitude + 35% Verbal + 25% Coding).
- **Placement Goal Customization**: Select target career paths (Product-Based, IT Services, FinTech, Startups) and target companies.
- **Personalized Recommendations Engine**:
  - Weak Spot Drills based on lowest-performing topics.
  - Company-specific mock test recommendations.
  - Daily Placement Sprint Checklist.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Lucide React, Vite 8.
- **Backend**: Node.js, Express.js (v5), MongoDB, Mongoose 9, JSON Web Token (JWT), Bcrypt.js.
- **Styling**: Tailwind CSS v4 modern design system with responsive layouts and accessible components.

---

## 🏁 Getting Started

### 1. Clone & Setup Backend
```bash
cd server
npm install
```

Ensure `server/.env` contains your MongoDB URI and secret:
```env
MONGO_URI=mongodb://127.0.0.1:27017/preptrack
PORT=5000
JWT_SECRET=preptrack_secret_jwt_key_2025_prod_ready
JWT_EXPIRES_IN=7d
```
*(You can also use your MongoDB Atlas connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/preptrack`)*

### 2. Seed Placement Data
Run the automated seed script to populate realistic questions, mock tests, and demo accounts:
```bash
npm run seed
```

**Pre-Configured Demo Accounts**:
- 🎓 **Student Account**: `student@preptrack.com` | Password: `student123`
- 🛡️ **Admin Account**: `admin@preptrack.com` | Password: `admin123`

### 3. Start Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

### 4. Setup & Start Frontend
In a new terminal:
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 📂 Project Structure

```
PrepTracks/
├── client/                     # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api/api.js          # Unified API service layer
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Responsive navigation with role indicators
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT auth & user state provider
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login with 1-click demo buttons
│   │   │   ├── Register.jsx    # Candidate & Admin registration
│   │   │   ├── Dashboard.jsx   # Recommendations, stats & quick drills
│   │   │   ├── Practice.jsx    # 4-category question bank & filters
│   │   │   ├── QuestionPractice.jsx # Interactive stopwatch & instant solutions
│   │   │   ├── MockTests.jsx   # Test catalog and past scorecards
│   │   │   ├── MockTestRunner.jsx # Full exam environment & countdown timer
│   │   │   ├── MockTestResult.jsx # Scorecard & solutions review
│   │   │   ├── CompanyPrep.jsx # Company Hub & dynamic readiness scores
│   │   │   ├── Analytics.jsx   # Deep performance analytics & weak areas
│   │   │   └── AdminPortal.jsx # Admin question & mock test management
│   │   ├── App.jsx             # Route definitions & guards
│   │   └── index.css           # Tailwind CSS v4 styling
│   └── vite.config.js
└── server/                     # Express + Mongoose REST API
    ├── config/db.js            # MongoDB connection with friendly fallbacks
    ├── controllers/
    │   ├── authController.js   # Auth, profile, and JWT generation
    │   ├── questionController.js # Questions CRUD & filtering
    │   ├── testController.js   # Mock tests CRUD, grading & history
    │   ├── attemptController.js# Question attempts
    │   ├── progressController.js# Analytics & weak/strong classification
    │   └── recommendationController.js # Recommendations & company readiness
    ├── models/
    │   ├── User.js             # User schema with roles & goals
    │   ├── Question.js         # Question schema (Aptitude, Verbal, DSA, CS)
    │   ├── MockTest.js         # Timed mock test schema
    │   ├── TestAttempt.js      # Mock test attempt & scorecard schema
    │   └── Attempt.js          # Individual question attempt schema
    ├── middleware/
    │   ├── authMiddleware.js   # JWT authentication verification
    │   └── roleMiddleware.js   # Role-based authorization guard
    ├── routes/                 # Express API routes
    ├── scripts/
    │   └── seed.js             # 35+ questions, 4 mock tests & demo users
    └── server.js               # Main application entrypoint
```
