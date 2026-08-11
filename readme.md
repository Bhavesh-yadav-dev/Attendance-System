# Smart Attendance System

An AI-powered face recognition attendance system built with Python (FastAPI), Node.js (Express), React, and MySQL.

---

## How It Works

1. **Register Student** — Upload student name, roll number and 3 face photos. The AI generates face embeddings and saves them to the database.
2. **Take Attendance** — Upload a classroom group photo. The AI detects all faces, matches them against registered students, and marks Present or Absent in the database.
3. **View Attendance** — Select a date to see the full attendance report with Present/Absent status for all students.

---

## Project Structure

```
Smart-Attendance-System/
│
├── ai-service/              # Python FastAPI - Face processing
│   ├── main.py              # FastAPI app with /train and /recognize routes
│   ├── train.py             # Generates face embeddings from 3 photos
│   ├── recognize.py         # Detects and matches faces in classroom photo
│   ├── db.py                # MySQL connection using .env
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # DB credentials (not committed to git)
│
├── server/                  # Node.js Express - Backend API
│   ├── server.js            # All API routes
│   ├── db.js                # MySQL connection pool
│   └── package.json
│
├── frontend/                # React - User Interface
│   └── attendance/
│       └── src/
│           ├── App.jsx              # Routes setup
│           └── component/
│               ├── Dashboard.jsx    # Home page with navigation cards
│               ├── Addstudent.jsx   # Register student page
│               ├── TakeAttendance.jsx  # Take attendance page
│               └── ShowAttendance.jsx  # View attendance page
│
└── database.sql             # MySQL schema
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Service | Python, FastAPI, DeepFace, FaceNet512, RetinaFace |
| Backend | Node.js, Express.js, MySQL2 |
| Frontend | React, React Router DOM, Vite |
| Database | MySQL |

---

## Database Schema

```sql
-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Face embeddings (3 per student)
CREATE TABLE face_embeddings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    photo_number INT NOT NULL,
    embedding JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Attendance records
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE (student_id, attendance_date)
);
```

---

## API Endpoints

### AI Service (Port 8500)

| Method | Route | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/test-db` | Test DB connection |
| POST | `/train` | Receive 3 images, return face embeddings |
| POST | `/recognize` | Receive classroom photo, return present students |

### Backend Server (Port 8000)

| Method | Route | Description |
|---|---|---|
| POST | `/api/student/register` | Register student with name, roll no, 3 photos |
| POST | `/api/attendance/take` | Upload classroom photo, save attendance |
| GET | `/api/attendance?date=YYYY-MM-DD` | Get attendance for a date |

---

## Setup and Installation

### 1. Database Setup

```sql
CREATE DATABASE attendance_system;
USE attendance_system;
-- Run database.sql file
```

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
```

Create `.env` file inside `ai-service/`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=attendance_system
```

Run AI service:

```bash
uvicorn main:app --reload --port 8500
```

### 3. Backend Server Setup

```bash
cd server
npm install
npm run dev
```

Update `db.js` with your MySQL credentials.

### 4. Frontend Setup

```bash
cd frontend/attendance
npm install
npm run dev
```

Open browser at `http://localhost:5173`

---

## Requirements

### Python (ai-service/requirements.txt)
```
opencv-python
deepface
numpy
tensorflow
fastapi
uvicorn
python-multipart
mysql-connector-python
python-dotenv
tf-keras
```

### Node.js
```
express, multer, cors, axios, form-data, mysql2
```

---

## Author

Bhavesh Yadav
Rahul Desai

And
**YantraX**
