# Task Assignment Application

## Overview
The Task Assignment Application is a task management system with a calendar interface. The application allows Managers to create, assign, and manage tasks for Employees under their supervision. Employees can view their assigned tasks and complete them accordingly. Additionally, all created tasks are also integrated with Google Calendar events for better tracking.

## Features

### Authentication
- Secure user authentication system.
- Role-based access control (RBAC) with two roles:
  - **Employee**: Can only view assigned tasks.
  - **Manager**: Can create, update, assign, and delete tasks for Employees under them.
- Managers can act as their own managers as well.

### Task Management
- CRUD operations (Create, Read, Update, Delete) for tasks.
- **Managers** can:
  - Click on the calendar interface to create new tasks.
  - Assign tasks to Employees.
  - Update or delete tasks.
  - View all tasks for Employees on a selected day.
- **Employees** can:
  - View only the tasks assigned to them.

### Calendar Interface
- Interactive calendar-based task management system.
- Similar UI/UX to Google Calendar or Outlook.
- Easy task scheduling by selecting a date.

### Google Calendar Integration
- When creating a task, it is automatically added as an event in **Google Calendar**.
- This ensures seamless tracking and synchronization with personal calendars.

## Tech Stack
- **Frontend:** React (TypeScript)
- **Backend:** Node.js (TypeScript)
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Authorization:** Role-based permissions
- **Third-Party Integration:** Google Calendar API

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance
- Google API credentials for Calendar integration

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/task-assignment-app.git
   cd task-assignment-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     ```
4. Start the backend server:
   ```bash
   npm run server
   ```
5. Start the frontend application:
   ```bash
   npm run client
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/signup` - Register new user

### Task Management
- `POST /tasks` - Create a new task (Managers only, integrates with Google Calendar)
- `GET /tasks` - Get tasks (Employees get only their tasks, Managers get all assigned tasks)
- `PUT /tasks/:id` - Update task (Managers only)
- `DELETE /tasks/:id` - Delete task (Managers only)

## License
This project is open-source and available under the [MIT License](LICENSE).

## Contributions
Feel free to fork the repository and submit pull requests to improve the application!

---

Enjoy managing tasks efficiently! 🚀