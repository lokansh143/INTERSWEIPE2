import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useTheme } from "./contexts/ThemeContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Signup from "./pages/Signup.jsx";
import SwipePage from "./pages/SwipePage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import MatchesPage from "./pages/MatchesPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CandidatesPage from "./pages/CandidatesPage.jsx";
import AcceptedStudentsPage from "./pages/AcceptedStudentsPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const homePath = user?.role === "recruiter" ? "/recruiter" : "/student";
  const isRecruiter = user?.role === "recruiter";

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <h1>InternSwipe</h1>
          {user && <span className="tag">{user.role || "student"}</span>}
        </div>
        <nav className="nav">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user ? (
            <>
              <Link to={homePath}>Dashboard</Link>
              {isRecruiter ? (
                <>
                  <Link to="/candidates">Students</Link>
                  <Link to="/matches">Matches</Link>
                  <Link to="/accepted-students">Accepted</Link>
                </>
              ) : (
                <>
                  <Link to="/swipe">Swipe</Link>
                  <Link to="/matches">Matches</Link>
                  <Link to="/profile">Profile</Link>
                </>
              )}
              <button className="button ghost" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/swipe"
            element={
              <PrivateRoute>
                <SwipePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/student"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <PrivateRoute>
                <RecruiterDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <PrivateRoute>
                <CandidatesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <MatchesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:matchId"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/accepted-students"
            element={
              <PrivateRoute>
                <AcceptedStudentsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
