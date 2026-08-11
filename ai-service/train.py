import os
import shutil
from deepface import DeepFace
from fastapi import UploadFile

# Folder to temporarily save uploaded images
TEMP_FOLDER = "temp_train"

def generate_embeddings(student_id: str, images: list):
    """
    Receives 3 images, generates face embeddings for each,
    and returns them as a list.

    student_id : roll number or ID of the student
    images     : list of 3 uploaded image files (UploadFile)
    """

    # Create a temp folder to save uploaded images
    if os.path.exists(TEMP_FOLDER):
        shutil.rmtree(TEMP_FOLDER)
    os.makedirs(TEMP_FOLDER)

    saved_paths = []

    # Save each uploaded image to temp folder
    for i, image in enumerate(images):
        image_path = os.path.join(TEMP_FOLDER, f"photo_{i+1}.jpg")
        with open(image_path, "wb") as f:
            f.write(image)
        saved_paths.append(image_path)

    embeddings = []

    # Generate embedding for each saved image
    for image_path in saved_paths:
        try:
            result = DeepFace.represent(
                img_path=image_path,
                model_name="Facenet512",
                detector_backend="retinaface",
                enforce_detection=False
            )
            # embedding is a list of 512 numbers
            embedding = result[0]["embedding"]
            embeddings.append(embedding)
            print(f"[OK] Embedding generated for {image_path}")

        except Exception as e:
            print(f"[FAILED] {image_path} - {e}")

    # Clean up temp folder after processing
    shutil.rmtree(TEMP_FOLDER)

    # If no embeddings were generated, return failure
    if len(embeddings) == 0:
        return {
            "success": False,
            "message": "No valid face found in the images.",
            "student_id": student_id,
            "embeddings": []
        }

    return {
        "success": True,
        "message": "Embeddings generated successfully.",
        "student_id": student_id,
        "embeddings": embeddings  # list of 3 embeddings (each is 512 numbers)
    }
