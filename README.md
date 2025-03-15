# Project Learning Management System (LMS) - Backend

## Overview
The **Project Learning Management System (LMS) Backend** is a RESTful API built using **Node.js, Express.js, and MongoDB** to manage courses, users, and learning progress. This backend provides authentication, role-based access control, course management, and progress tracking for students and instructors.

## Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Instructor, Student)
- **User Management**
  - Register, login, and profile management
- **Course Management**
  - Create, update, delete, and list courses
  - Assign instructors to courses
- **Student Enrollment & Progress Tracking**
  - Enroll students in courses
  - Track lesson completion


## Tech Stack
- **Node.js** (Runtime environment)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **JWT** (Authentication)
- **bcrypt.js** (Password hashing)
- **Nodemailer** (Email notifications)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>=14.x)
- MongoDB (Cloud or Local Instance)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/lms-backend.git
   cd lms-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add the following:
   ```env
   PORT=9000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
| Method | Endpoint                 | Description                   | Access  |
|--------|--------------------------|-------------------------------|---------|
| POST   | `/api/auth/register`      | Register a new user           | Public  |
| POST   | `/api/auth/login`         | Login user and get token      | Public  |
| GET    | `/api/users/me`           | Get current user details      | Authenticated |
| POST   | `/api/courses`            | Create a new course           | Admin/Instructors |
| GET    | `/api/courses`            | Get all courses               | Public  |
| GET    | `/api/courses/:id`        | Get course details            | Public  |
| POST   | `/api/courses/:id/enroll` | Enroll student in course      | Authenticated |
| PUT    | `/api/courses/:id`        | Update course details         | Admin/Instructors |
| DELETE | `/api/courses/:id`        | Delete a course               | Admin  |

## Folder Structure
```
LMS-Backend/
├── controllers/    # Business logic for each route
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── middleware/     # Authentication and error handling
├── config/         # Configuration files
├── utils/          # Helper functions
├── .env            # Environment variables
├── server.js       # Entry point of the application
```

## Future Enhancements
- Payment gateway integration for paid courses
- Live chat and discussion forums
- AI-based course recommendations
- Mobile app API support

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature-branch`)
5. Create a Pull Request

## License
This project is licensed under the MIT License.

---

Happy coding! 🚀