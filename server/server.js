import express from "express";
import multer from "multer";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";

import db from "./db.js";


const app = express();

app.use(express.json());
app.use(cors());


const PORT = 8000;


const upload = multer({
  storage: multer.memoryStorage(),
});


app.post(
  "/api/student/register",
  upload.array("photos", 3),

  async (req, res) => {

    try {

      const { name, rollNo } = req.body;
      const photos = req.files;


      // -----------------------------
      // VALIDATION
      // -----------------------------

      if (!name || !rollNo || !photos || photos.length !== 3) {

        return res.status(400).json({
          success: false,
          message: "Name, roll number and 3 photos are required"
        });

      }


      console.log("Name:", name);
      console.log("Roll No:", rollNo);
      console.log("Photos:", photos.length);


      // -----------------------------
      // SEND DATA TO PYTHON
      // -----------------------------

      const form = new FormData();

      form.append("student_id", rollNo);

      // Python expects photo1, photo2, photo3 as separate fields
      form.append("photo1", photos[0].buffer, { filename: photos[0].originalname, contentType: photos[0].mimetype });
      form.append("photo2", photos[1].buffer, { filename: photos[1].originalname, contentType: photos[1].mimetype });
      form.append("photo3", photos[2].buffer, { filename: photos[2].originalname, contentType: photos[2].mimetype });


      const pythonResponse = await axios.post(
        "http://127.0.0.1:8500/train",

        form,

        {
          headers: {
            ...form.getHeaders()
          }
        }
      );


      const pythonData = pythonResponse.data;


      console.log(
        "Python response:",
        pythonData
      );


      // -----------------------------
      // GET EMBEDDINGS
      // -----------------------------

      const embeddings = pythonData.embeddings;


      if (
        !embeddings ||
        embeddings.length !== 3
      ) {

        return res.status(400).json({
          success: false,
          message: "Python did not return 3 embeddings"
        });

      }


      // -----------------------------
      // SAVE STUDENT
      // -----------------------------

      const [studentResult] = await db.execute(

        `INSERT INTO students
        (name, roll_no)
        VALUES (?, ?)`,

        [name, rollNo]

      );                                                                                                                                                                                


      const studentId = studentResult.insertId;


      console.log(
        "Student ID:",
        studentId
      );


      // -----------------------------
      // SAVE EMBEDDINGS
      // -----------------------------

      for (let i = 0; i < embeddings.length; i++) {

        await db.execute(

          `INSERT INTO face_embeddings
          (student_id, photo_number, embedding)
          VALUES (?, ?, ?)`,

          [
            studentId,
            i + 1,
            JSON.stringify(embeddings[i])
          ]

        );

      }


      console.log(
        "Embeddings saved successfully"
      );


      // -----------------------------
      // SEND RESPONSE
      // -----------------------------

      res.status(201).json({

        success: true,

        message: "Student registered successfully",

        student: {
          id: studentId,
          name: name,
          rollNo: rollNo
        },

        embeddingsSaved: embeddings.length

      });


    } catch (error) {

      console.error(
        "Registration error:",
        error.message
      );


      res.status(500).json({

        success: false,

        message: "Student registration failed",

        error: error.message

      });

    }

  }
);


app.post(
  "/api/attendance/take",
  upload.single("photo"),
  async (req, res) => {
    try {
      const photo = req.file;

      if (!photo) {
        return res.status(400).json({
          success: false,
          message: "Classroom photo is required",
        });
      }

      console.log("Attendance photo received:");
      console.log("Name:", photo.originalname);
      console.log("Type:", photo.mimetype);
      console.log("Size:", photo.size);


      // -----------------------------
      // Send photo to Python
      // -----------------------------

      const form = new FormData();

      form.append(
        "classroom_photo",
        photo.buffer,
        {
          filename: photo.originalname,
          contentType: photo.mimetype,
        }
      );


      const pythonResponse = await axios.post(
        "http://localhost:8500/recognize",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );


      // -----------------------------
      // Python response
      // -----------------------------

      const pythonData = pythonResponse.data;

      console.log(
        "Python result:",
        pythonData
      );

      // -----------------------------
      // Save attendance to DB
      // -----------------------------

      // Get all students from DB
      const [allStudents] = await db.execute(
        "SELECT id FROM students"
      );

      // Make a set of present student IDs (from Python response)
      const presentIds = new Set(
        pythonData.present_students.map(s => s.student_id)
      );

      // Save Present or Absent for every student
      for (const student of allStudents) {
        const status = presentIds.has(student.id) ? "Present" : "Absent";

        await db.execute(
          `INSERT INTO attendance (student_id, attendance_date, status)
           VALUES (?, CURDATE(), ?)
           ON DUPLICATE KEY UPDATE status = VALUES(status)`,
          [student.id, status]
        );
      }

      console.log("Attendance saved to DB");

      // -----------------------------
      // Send result to frontend
      // -----------------------------

      res.json({
        success: true,
        message: "Attendance processed successfully",
        result: pythonData,
      });

    } catch (error) {

      console.error(
        "Attendance error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Attendance processing failed",
      });
    }
  }
);


// -----------------------------
// GET /api/attendance?date=YYYY-MM-DD
// Fetch attendance for a specific date
// -----------------------------

app.get("/api/attendance", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    // Get all students and their attendance status for the given date
    const [rows] = await db.execute(
      `SELECT s.name, s.roll_no,
        COALESCE(a.status, 'Absent') AS status
       FROM students s
       LEFT JOIN attendance a
         ON s.id = a.student_id AND a.attendance_date = ?
       ORDER BY s.roll_no`,
      [date]
    );

    res.json({
      success: true,
      date: date,
      attendance: rows
    });

  } catch (error) {
    console.error("Fetch attendance error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance"
    });
  }
});


app.listen(PORT, () => {

  console.log(
    `Express running on http://localhost:${PORT}`
  );

});

