# 📆 Task Assignment Application

## 🔍 Overview
The Task Assignment Application is a comprehensive task management system featuring an intuitive calendar interface. This platform enables Managers to efficiently create, assign, and manage tasks for Employees under their supervision. Employees can easily view and complete their assigned tasks. All tasks seamlessly integrate with Google Calendar for enhanced tracking and productivity.

## ✨ Features

### 🔐 Authentication
- Secure user authentication system
- Role-based access control (RBAC):
  - **Employee**: View and manage assigned tasks
  - **Manager**: Full control over task creation, assignment, and management
- Self-management capabilities for Managers

### 📋 Task Management
- **Managers can:**
  - Create new tasks directly from the calendar interface
  - Assign tasks to specific Employees
  - Update or delete existing tasks
  - View all Employee tasks for any selected day
- **Employees can:**
  - Access a personalized view of assigned tasks
  - Mark tasks as completed

### 📅 Calendar Interface
- Interactive, user-friendly calendar design
- Familiar UI/UX inspired by Google Calendar and Outlook
- Simple task scheduling through date selection

### 🔄 Google Calendar Integration
- Automatic synchronization with Google Calendar
- Tasks appear as events in users' personal calendars
- Seamless tracking across platforms

## 🛠️ Tech Stack
- **Frontend:** React (TypeScript)
- **Backend:** Node.js (TypeScript)
- **Database:** MongoDB
- **Authentication:** JWT-based system
- **Authorization:** Role-based permissions
- **Integration:** Google Calendar API

## 📝 Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance
- Google API credentials for Calendar integration

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/task-assignment-app.git
   cd task-assignment-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     ```

4. **Start the backend server:**
   ```bash
   npm run server
   ```

5. **Start the frontend application:**
   ```bash
   npm run client
   ```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/auth/signup` | Register new user |

### Task Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/tasks` | Create a new task | Managers only |
| GET | `/tasks` | Get tasks | Role-based access |
| PUT | `/tasks/:id` | Update task | Managers only |
| DELETE | `/tasks/:id` | Delete task | Managers only |

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

## 👥 Contributions
We welcome contributions! Feel free to fork the repository and submit pull requests to improve the application.

---

### 🚀 Enjoy managing tasks efficiently!