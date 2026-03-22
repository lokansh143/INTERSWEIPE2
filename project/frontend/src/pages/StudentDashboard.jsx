import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ matchScore: 0, saved: 0, chats: 0 });
  const [indiaAccess, setIndiaAccess] = useState({ optedIn: false, preferredState: "" });

  useEffect(() => {
    // Load profile from localStorage
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }

    // Load all-India access preferences
    const india = localStorage.getItem("indiaAccess");
    if (india) {
      setIndiaAccess(JSON.parse(india));
    }

    // Fetch matches
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_BASE}/matches?status=accepted`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.name, profile.email, profile.major, profile.university, 
                    profile.graduationYear, profile.skills, profile.headline, profile.bio];
    const filled = fields.filter(f => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const stateOptions = [
    "Maharashtra",
    "Delhi NCR",
    "Karnataka",
    "Telangana",
    "Tamil Nadu",
    "Kerala",
    "West Bengal",
    "Uttar Pradesh",
    "Gujarat"
  ];

  const indiaHighlights = [
    { label: "States & UTs", value: "36" },
    { label: "Partner campuses", value: "120+" },
    { label: "Virtual cohorts", value: "24" }
  ];

  const saveIndiaAccess = (payload) => {
    setIndiaAccess(payload);
    localStorage.setItem("indiaAccess", JSON.stringify(payload));
  };

  const handleStateChange = (event) => {
    const stateName = event.target.value;
    if (!stateName) {
      saveIndiaAccess({ ...indiaAccess, preferredState: "" });
      return;
    }
    saveIndiaAccess({ ...indiaAccess, preferredState: stateName });
  };

  const handleAllIndiaJoin = () => {
    if (!indiaAccess.preferredState) return;
    saveIndiaAccess({ ...indiaAccess, optedIn: true });
  };

  const acceptedMatches = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Apex Systems",
      location: "Austin, TX",
      match: 90
    },
    {
      id: 2,
      title: "Data Analyst Intern",
      company: "Lumen Metrics",
      location: "New York, NY",
      match: 86
    },
    {
      id: 3,
      title: "Product Design Intern",
      company: "Northwind Labs",
      location: "Remote",
      match: 84
    }
  ];

  return (
    <section className="card dashboard-container">
      <div className="page-header">
        <div>
          <p className="welcome-text">Welcome back{profile?.name ? `, ${profile.name}` : ""}! 👋</p>
          <h2>Student Dashboard</h2>
          <p className="muted">Track your progress and manage your profile.</p>
        </div>
        <div className="page-actions">
          <button 
            className="button secondary" 
            type="button"
            onClick={() => navigate("/profile")}
          >
            Update profile
          </button>
          <button 
            className="button" 
            type="button"
            onClick={() => navigate("/swipe")}
          >
            Start swiping
          </button>
        </div>
      </div>

      {/* Profile Completion Banner */}
      {profileCompletion < 100 && (
        <div className="profile-banner">
          <div className="banner-content">
            <div className="banner-icon">📝</div>
            <div>
              <h4>Complete your profile</h4>
              <p className="muted">Your profile is {profileCompletion}% complete. Add more details to improve your match score!</p>
            </div>
          </div>
          <button className="button" onClick={() => navigate("/profile")}>
            Complete Profile
          </button>
        </div>
      )}

      <div className="stats">
        <div className="stat">
          <h4>Profile score</h4>
          <strong>{profileCompletion}%</strong>
        </div>
        <div className="stat">
          <h4>Saved internships</h4>
          <strong>{stats.saved}</strong>
        </div>
        <div className="stat">
          <h4>Pending chats</h4>
          <strong>{stats.chats}</strong>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card" onClick={() => navigate("/swipe")}>
          <div className="action-icon">👆</div>
          <div>
            <h4>Swipe Internships</h4>
            <p className="muted">Discover new opportunities</p>
          </div>
          <span className="action-arrow">→</span>
        </div>
        <div className="action-card" onClick={() => navigate("/matches")}>
          <div className="action-icon">🎯</div>
          <div>
            <h4>View Matches</h4>
            <p className="muted">See your matched internships</p>
          </div>
          <span className="action-arrow">→</span>
        </div>
        <div className="action-card" onClick={() => navigate("/profile")}>
          <div className="action-icon">✏️</div>
          <div>
            <h4>Edit Profile</h4>
            <p className="muted">Update your skills & info</p>
          </div>
          <span className="action-arrow">→</span>
        </div>
      </div>

      <div className="role-focus">
        <div className="card soft">
          <h3>Student focus</h3>
          <ul className="feature-list">
            <li>Fast swipe matching to find internships</li>
            <li>Personalized skills and career insights</li>
            <li>One-click application tracking</li>
          </ul>
        </div>
        <div className="card soft">
          <h3>Next steps</h3>
          <ul className="feature-list">
            <li>{profileCompletion < 100 ? "Complete your profile for better matches" : "✓ Profile completed!"}</li>
            <li>Start swiping to find internships</li>
            <li>Schedule interviews from your match list</li>
          </ul>
        </div>
      </div>

      <div className="card soft">
        <div className="page-header" style={{ alignItems: "flex-start" }}>
          <div>
            <h3>All-India Access</h3>
            <p className="muted">
              Students across India can join virtual cohorts and regional meetups. Pick your state to tap into
              local mentors and nationwide hiring drives.
            </p>
          </div>
          <span className="tag accent">Nationwide</span>
        </div>
        <div className="stats" style={{ marginBottom: "16px" }}>
          {indiaHighlights.map((item) => (
            <div className="stat" key={item.label}>
              <h4>{item.label}</h4>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        <div className="quick-actions" style={{ gap: "16px" }}>
          <div className="action-card" style={{ flex: 2 }}>
            <div>
              <label htmlFor="india-state" className="muted" style={{ display: "block", marginBottom: "8px" }}>
                Preferred state or region
              </label>
              <select
                id="india-state"
                value={indiaAccess.preferredState}
                onChange={handleStateChange}
                style={{ width: "100%", padding: "8px", borderRadius: "8px" }}
              >
                <option value="">Select your region</option>
                {stateOptions.map((state) => (
                  <option value={state} key={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="action-card" style={{ flex: 1 }}>
            <p className="muted" style={{ marginBottom: "8px" }}>
              {indiaAccess.optedIn
                ? `You are representing ${indiaAccess.preferredState || "India"} in the nationwide cohort.`
                : "Lock your seat in the nationwide student cohort."}
            </p>
            <button
              className={`button ${indiaAccess.optedIn ? "secondary" : ""}`}
              type="button"
              disabled={!indiaAccess.preferredState}
              onClick={handleAllIndiaJoin}
              style={{ width: "100%" }}
            >
              {indiaAccess.optedIn ? "Joined All-India Cohort" : "Join All-India Cohort"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Your Matches</h3>
          <span className="tag">{acceptedMatches.length} matched</span>
          <div className="match-cards">
            {acceptedMatches.map((match) => (
              <div className="match-card" key={match.id}>
                <div>
                  <h4>{match.title}</h4>
                  <p className="muted">{match.company} · {match.location}</p>
                </div>
                <span className="tag accent">{match.match}% match</span>
              </div>
            ))}
          </div>
          <button className="button secondary full-width" onClick={() => navigate("/matches")} style={{ marginTop: "12px" }}>
            View All Matches
          </button>
        </div>

        <div className="card">
          <h3>Profile Status</h3>
          <span className={`tag ${profileCompletion >= 80 ? "success" : ""}`}>
            {profileCompletion >= 80 ? "Complete" : "Incomplete"}
          </span>
          <ul className="feature-list">
            <li>{profile?.skills ? "✓ Skills added" : "○ Add skills"}</li>
            <li>{profile?.headline ? "✓ Headline set" : "○ Add headline"}</li>
            <li>{profile?.university ? "✓ Education added" : "○ Add education"}</li>
            <li>{profile?.experience ? "✓ Experience described" : "○ Add experience"}</li>
          </ul>
          <button className="button full-width" onClick={() => navigate("/profile")} style={{ marginTop: "12px" }}>
            Update Profile
          </button>
        </div>

        <div className="card">
          <h3>Career Insights</h3>
          <span className="tag">Coming soon</span>
          <ul className="feature-list">
            <li>Skill gap analysis</li>
            <li>Career trajectory</li>
            <li>Suggested learning</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
