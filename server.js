import express from "express";
import multer from "multer";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8000;

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/api/student/register", upload.array("photos", 3), async (req, res) => {
  try {
    const { name, rollNo } = req.body;
    const photos = req.files;

    console.log("Name:", name);
    console.log("Roll No:", rollNo);
    console.log("Number of photos:", photos.length);

    photos.forEach((photo, index) => {
      console.log(
        `Photo ${index + 1}:`,
        photo.originalname,
        photo.mimetype,
        photo.size,
      );
    });

     // Create form-data for Python
    //   const form = new FormData();

    //   // Send student information
    //   form.append("name", name);
    //   form.append("rollNo", rollNo);

    //   // Send all 3 photos
    //   photos.forEach((photo) => {
    //     form.append(
    //       "photos",
    //       photo.buffer,
    //       {
    //         filename: photo.originalname,
    //         contentType: photo.mimetype
    //       }
    //     );
    //   });

    //   // Send request to Python
    //   const pythonResponse = await axios.post(
    //     "PYHTON_URL",
    //     form,
    //     {
    //       headers: {
    //         ...form.getHeaders()
    //       }
    //     }
    //   );

    //   // Python response
    //   console.log("Python response:", pythonResponse.data);

    //   res.json({
    //     success: true,
    //     message: "Student sent to Python successfully",
    //     pythonResult: pythonResponse.data
    //   });


    res.json({
      success: true,
      message: "Student data received",
      student: {
        name,
        rollNo,
        photoCount: photos.length,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`The server is properly running on port ${PORT}`);
});
