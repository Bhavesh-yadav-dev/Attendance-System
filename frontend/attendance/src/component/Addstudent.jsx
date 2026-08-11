import React, { useState } from 'react';
import './Addstudent.css';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [photos, setPhotos] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePhotoChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    const updatedPhotos = [...photos];
    updatedPhotos[index] = file;
    setPhotos(updatedPhotos);

    const updatedPreviews = [...previews];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviews(updatedPreviews);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter student name.' });
      return;
    }

    if (!rollNo.trim()) {
      setMessage({ type: 'error', text: 'Please enter roll number.' });
      return;
    }

    const uploadedCount = photos.filter((p) => p !== null).length;
    if (uploadedCount !== 3) {
      setMessage({
        type: 'error',
        text: `Please upload all 3 photos (Currently ${uploadedCount}/3 uploaded).`,
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('rollNo', rollNo.trim());

      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      const response = await fetch('http://localhost:8000/api/student/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Student registered successfully!',
        });
        // Reset Form
        setName('');
        setRollNo('');
        setPhotos([null, null, null]);
        previews.forEach((url) => url && URL.revokeObjectURL(url));
        setPreviews([null, null, null]);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to register student.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({
        type: 'error',
        text: 'Unable to connect to server. Please check backend.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-page">
      <div className="student-card">
        <h1>Register New Student</h1>
        <p className="subtitle">Fill in details and upload 3 images for face recognition</p>

        {message.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              id="studentName"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              id="rollNumber"
              type="text"
              placeholder="e.g. 101"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </div>

          <div className="photo-section">
            <label>Upload 3 Photos</label>
            <div className="photo-grid">
              {[0, 1, 2].map((index) => (
                <div key={index} className="photo-box">
                  {previews[index] ? (
                    <img src={previews[index]} alt={`Student Photo ${index + 1}`} />
                  ) : (
                    <div className="photo-placeholder">
                      <span>📷</span>
                      <p>Photo {index + 1}</p>
                    </div>
                  )}
                  <label className="photo-button">
                    {photos[index] ? 'Change Photo' : `Upload Photo ${index + 1}`}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(index, e)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Registering Student...' : 'Register Student'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
