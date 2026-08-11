import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard';
import AddStudent from './component/Addstudent';
import TakeAttendance from './component/TakeAttendance';
import ShowAttendance from './component/ShowAttendance';
import Navbar from './component/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard - no navbar, full landing page */}
        <Route path="/" element={<Dashboard />} />

        {/* All other pages - with navbar on top */}
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <AddStudent />
            </>
          }
        />
        <Route
          path="/attendance/take"
          element={
            <>
              <Navbar />
              <TakeAttendance />
            </>
          }
        />
        <Route
          path="/attendance/show"
          element={
            <>
              <Navbar />
              <ShowAttendance />
            </>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
