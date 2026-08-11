import React, { useState } from 'react';

const ShowAttendance = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFetch = async (e) => {
    e.preventDefault();

    if (!date) {
      setMessage({ type: 'error', text: 'Please select a date.' });
      return;
    }

    setLoading(true);
    setAttendance(null);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`http://localhost:8000/api/attendance?date=${date}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setAttendance(data.attendance);
        setMessage({ type: 'success', text: `Showing attendance for ${date}` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch attendance.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  // Count present and absent
  const presentCount = attendance ? attendance.filter(s => s.status === 'Present').length : 0;
  const absentCount = attendance ? attendance.filter(s => s.status === 'Absent').length : 0;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>View Attendance</h1>
        <p style={styles.subtitle}>Select a date to see who was present</p>

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

        {/* Date form */}
        <form onSubmit={handleFetch} style={styles.form}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
          />
          <button type="submit" style={styles.fetchBtn} disabled={loading}>
            {loading ? 'Loading...' : 'Show Attendance'}
          </button>
        </form>

        {/* Attendance Table */}
        {attendance && (
          <div>
            {/* Summary */}
            <div style={styles.summary}>
              <div style={{ ...styles.summaryBox, background: '#dcfce7', color: '#15803d' }}>
                <strong>{presentCount}</strong>
                <span>Present</span>
              </div>
              <div style={{ ...styles.summaryBox, background: '#fee2e2', color: '#b91c1c' }}>
                <strong>{absentCount}</strong>
                <span>Absent</span>
              </div>
              <div style={{ ...styles.summaryBox, background: '#e0e7ff', color: '#4338ca' }}>
                <strong>{attendance.length}</strong>
                <span>Total</span>
              </div>
            </div>

            {attendance.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>No attendance records for this date.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Roll No</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((student, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.roll_no}</td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: student.status === 'Present' ? '#dcfce7' : '#fee2e2',
                          color: student.status === 'Present' ? '#15803d' : '#b91c1c',
                        }}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    maxWidth: '700px',
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
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  dateInput: {
    flex: 1,
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
  },
  fetchBtn: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  summary: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  summaryBox: {
    flex: 1,
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '500',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
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

export default ShowAttendance;
