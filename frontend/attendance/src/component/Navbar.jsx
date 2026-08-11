import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      {/* Clicking brand goes back to dashboard */}
      <div style={styles.brand} onClick={() => navigate('/')}>
        Smart Attendance System
      </div>
      <div style={styles.links}>
        <button style={styles.btn} onClick={() => navigate('/register')}>Register</button>
        <button style={styles.btn} onClick={() => navigate('/attendance/take')}>Take Attendance</button>
        <button style={styles.btn} onClick={() => navigate('/attendance/show')}>View Attendance</button>
        <button style={{ ...styles.btn, ...styles.homeBtn }} onClick={() => navigate('/')}>Dashboard</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: '#4f46e5',
    color: 'white',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    gap: '10px',
  },
  btn: {
    padding: '8px 16px',
    border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: '8px',
    background: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  homeBtn: {
    background: 'white',
    color: '#4f46e5',
    border: '2px solid white',
  },
};

export default Navbar;
