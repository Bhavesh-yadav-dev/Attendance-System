import { useNavigate } from 'react-router-dom';

// Each card on the dashboard
const cards = [
  {
    title: 'Register Student',
    description: 'Add a new student with name, roll number and 3 face photos.',
    icon: '👤',
    route: '/register',
    color: '#4f46e5',
  },
  {
    title: 'Take Attendance',
    description: 'Upload a classroom photo and mark attendance automatically.',
    icon: '📸',
    route: '/attendance/take',
    color: '#0891b2',
  },
  {
    title: 'View Attendance',
    description: 'Select a date and see who was present or absent.',
    icon: '📋',
    route: '/attendance/show',
    color: '#16a34a',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Smart Attendance System</h1>
        <p style={styles.subtitle}>AI-powered face recognition attendance tracker</p>
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.route}
            style={styles.card}
            onClick={() => navigate(card.route)}
          >
            {/* Icon circle */}
            <div style={{ ...styles.iconBox, background: card.color }}>
              <span style={{ fontSize: '32px' }}>{card.icon}</span>
            </div>

            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.cardDesc}>{card.description}</p>

            <div style={{ ...styles.goBtn, color: card.color }}>
              Go → 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    padding: '50px 30px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '36px',
    color: '#1e1b4b',
    margin: 0,
  },
  subtitle: {
    color: '#777',
    marginTop: '10px',
    fontSize: '16px',
  },
  grid: {
    display: 'flex',
    gap: '25px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '35px',
    width: '280px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'center',
  },
  iconBox: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
  },
  cardTitle: {
    fontSize: '20px',
    color: '#1e1b4b',
    margin: '0 0 10px 0',
  },
  cardDesc: {
    color: '#777',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
  },
  goBtn: {
    fontWeight: '700',
    fontSize: '15px',
  },
};

export default Dashboard;
