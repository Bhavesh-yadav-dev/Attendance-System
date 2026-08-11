CREATE DATABASE attendance_system;

USE attendance_system;


-- 1. Students
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. Face Embeddings
CREATE TABLE face_embeddings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    photo_number INT NOT NULL,
    embedding JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);


-- 3. Attendance
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    UNIQUE (student_id, attendance_date)
);


SELECT * FROM students;
SELECT * FROM face_embeddings;