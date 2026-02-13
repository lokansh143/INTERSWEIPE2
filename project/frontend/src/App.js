import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SwipePage from "./pages/SwipePage";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>InternSwipe</h1>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Login />} />
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
        </Routes>
      </main>
    </div>
  );
}
