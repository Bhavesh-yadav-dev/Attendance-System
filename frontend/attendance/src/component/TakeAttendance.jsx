import React, { useState } from 'react';

const TakeAttendance = () => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setMessage({ type: 'error', text: 'Please upload a classroom photo.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await fetch('http://localhost:8000/api/attendance/take', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.result);
        setMessage({ type: 'success', text: 'Attendance taken successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to take attendance.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Take Attendance</h1>
        <p style={styles.subtitle}>Upload a classroom photo to mark attendance</p>

        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.alert,
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Photo upload box */}
          <div style={styles.uploadBox}>
            {preview ? (
              <img src={preview} alt="Classroom" style={styles.previewImg} />
            ) : (
              <div style={styles.placeholder}>
                <span style={{ fontSize: '50px' }}>📸</span>
                <p>No photo selected</p>
              </div>
            )}
          </div>

          <label style={styles.uploadBtn}>
            {photo ? 'Change Photo' : 'Upload Classroom Photo'}
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </label>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Take Attendance'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div style={styles.resultBox}>
            <h3 style={{ marginTop: 0 }}>Result</h3>
            <p>Total faces detected: <strong>{result.total_faces_detected}</strong></p>
            <p>Students present: <strong>{result.total_present}</strong></p>

            {result.present_students && result.present_students.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Roll No</th>
                  </tr>
                </thead>
                <tbody>
                  {result.present_students.map((student, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.roll_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#999' }}>No students recognized.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: '#f5f7fb',
    padding: '30px',
  },
  card: {
    width: '100%',
    maxWidth: '650px',
    background: 'white',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  },
  title: { margin: 0, fontSize: '28px', color: '#222' },
  subtitle: { color: '#777', marginBottom: '20px' },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  uploadBox: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '15px',
    textAlign: 'center',
    marginBottom: '15px',
    minHeight: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImg: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  placeholder: { color: '#999' },
  uploadBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '10px',
    background: '#f0f0f0',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resultBox: {
    marginTop: '25px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #f3f4f6',
  },
};

export default TakeAttendance;
