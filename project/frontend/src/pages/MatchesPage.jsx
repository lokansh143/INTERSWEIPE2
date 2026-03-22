import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const API_BASE = "http://localhost:5000/api";
const CHAT_API = "http://localhost:5000/api/chat";

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filter, setFilter] = useState("all");
  const [startingChatId, setStartingChatId] = useState(null);
  const navigate = useNavigate();

  const isRecruiter = user?.role === "recruiter";

  useEffect(() => {
    fetchMatches();
  }, [isRecruiter]);

  const fetchMatches = async () => {
    try {
      if (isRecruiter) {
        // Fetch AI-matched students based on internship cards
        const res = await fetch(`${API_BASE}/ai/matches/recruiter`);
        const data = await res.json();
        setMatches(data.matches || []);
      } else {
        // For students, fetch their matches
        const res = await fetch(`${API_BASE}/matches`);
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (match) => {
    try {
      // Create accepted match in backend
      const res = await fetch(`${API_BASE}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: match.student.id,
          studentName: match.student.name,
          studentEmail: match.student.email,
          studentSkills: match.student.skills,
          internshipId: match.internship.id,
          internshipTitle: match.internship.title,
          company: match.internship.company,
          recruiterId: "current-user",
          score: match.score
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update status to accepted
        await fetch(`${API_BASE}/matches/${data.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" })
        });
        
        // Remove from current list
        setMatches(prev => prev.filter(m => m.id !== match.id));
        setSelectedMatch(null);
        alert(`${match.student.name} has been accepted for ${match.internship.title}!`);
      }
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  const handleReject = (matchId) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    if (selectedMatch?.id === matchId) setSelectedMatch(null);
  };

  const handleStartChat = async (match) => {
    try {
      setStartingChatId(match.id);
      const senderId = user?.id || user?.email || "student-demo";
      const senderName = user?.name || user?.email || "Student";
      const senderRole = user?.role || "student";
      const intro = `Hi ${match.company} team, this is ${senderName}. I'm excited about the ${match.internshipTitle} role!`;

      const response = await fetch(`${CHAT_API}/match/${match.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, senderName, senderRole, message: intro })
      });

      if (!response.ok) {
        throw new Error("Unable to start chat");
      }

      navigate(`/chat/${match.id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not start the conversation. Try again.");
    } finally {
      setStartingChatId(null);
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === "all") return true;
    if (filter === "high") return m.score >= 70;
    if (filter === "medium") return m.score >= 50 && m.score < 70;
    return m.score < 50;
  });

  // Group matches by internship for recruiters
  const groupedByInternship = {};
  if (isRecruiter) {
    filteredMatches.forEach(match => {
      const key = match.internship.id;
      if (!groupedByInternship[key]) {
        groupedByInternship[key] = {
          internship: match.internship,
          matches: []
        };
      }
      groupedByInternship[key].matches.push(match);
    });
  }

  if (!isRecruiter) {
    // Student view - simple list
    return (
      <section className="card">
        <div className="page-header">
          <div>
            <h2>Your Matches</h2>
            <p className="muted">Internships that match your profile.</p>
          </div>
        </div>
        {loading ? (
          <p className="muted">Loading matches...</p>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <h3>No matches yet</h3>
            <p className="muted">Keep swiping to find matching internships!</p>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map(match => (
              <div key={match.id} className="match-card">
                <h4>{match.internshipTitle}</h4>
                <p className="muted">{match.company}</p>
                <span className="tag accent">{match.score}% match</span>
                <div style={{ marginTop: "12px" }}>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleStartChat(match)}
                    disabled={startingChatId === match.id}
                  >
                    {startingChatId === match.id ? "Opening chat…" : "Message recruiter"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // Recruiter view
  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h2>AI-Matched Students</h2>
          <p className="muted">Students whose skills match your internship requirements.</p>
        </div>
        <div className="page-actions">
          <select 
            className="filter-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Matches</option>
            <option value="high">High Match (70%+)</option>
            <option value="medium">Medium Match (50-69%)</option>
            <option value="low">Low Match (&lt;50%)</option>
          </select>
          <span className="tag accent">{filteredMatches.length} matches</span>
        </div>
      </div>

      {loading ? (
        <p className="muted">Analyzing student profiles...</p>
      ) : Object.keys(groupedByInternship).length === 0 ? (
        <div className="empty-state">
          <h3>No matches found</h3>
          <p className="muted">Create internship cards with required skills to see matching students.</p>
        </div>
      ) : (
        <div className="recruiter-matches-layout">
          <div className="matches-by-role">
            {Object.values(groupedByInternship).map(group => (
              <div key={group.internship.id} className="role-match-group">
                <div className="role-header">
                  <h3>{group.internship.title}</h3>
                  <span className="tag">{group.internship.company}</span>
                  <span className="muted">· {group.matches.length} candidates</span>
                </div>
                <div className="role-skills">
                  {(group.internship.skills || []).map((skill, i) => (
                    <span key={i} className="chip">{skill}</span>
                  ))}
                </div>
                <div className="role-candidates">
                  {group.matches.map(match => (
                    <div 
                      key={match.id} 
                      className={`candidate-match-card ${selectedMatch?.id === match.id ? "selected" : ""}`}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="candidate-avatar">
                        {match.student.name.charAt(0)}
                      </div>
                      <div className="candidate-info">
                        <h4>{match.student.name}</h4>
                        <p className="muted">{match.student.major} · {match.student.university}</p>
                        <div className="matched-skills">
                          {match.matchedSkills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="skill-match-tag">{skill}</span>
                          ))}
                          {match.matchedSkills.length > 3 && (
                            <span className="muted">+{match.matchedSkills.length - 3} more</span>
                          )}
                        </div>
                      </div>
                      <div className="match-score-badge">
                        <strong>{match.score}%</strong>
                        <span>match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedMatch && (
            <div className="match-detail-panel">
              <div className="match-detail-header">
                <div className="detail-avatar">
                  {selectedMatch.student.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedMatch.student.name}</h3>
                  <p className="muted">{selectedMatch.student.email}</p>
                </div>
                <button className="close-btn" onClick={() => setSelectedMatch(null)}>×</button>
              </div>

              <div className="match-for-role">
                <span className="muted">Matched for:</span>
                <strong>{selectedMatch.internship.title}</strong>
              </div>

              <div className="match-score-display">
                <div className="score-circle large">
                  <span className="score-value">{selectedMatch.score}%</span>
                </div>
                <div>
                  <strong>Match Score</strong>
                  <p className="muted">Based on skill overlap analysis</p>
                </div>
              </div>

              <div className="detail-section">
                <h4>Education</h4>
                <p>{selectedMatch.student.major}</p>
                <p className="muted">{selectedMatch.student.university}</p>
                <p className="muted">GPA: {selectedMatch.student.gpa} · Grad: {selectedMatch.student.grad}</p>
              </div>

              <div className="detail-section">
                <h4>Availability</h4>
                <p>{selectedMatch.student.availability}</p>
              </div>

              <div className="detail-section">
                <h4>About</h4>
                <p>{selectedMatch.student.headline}</p>
                <p className="muted">{selectedMatch.student.experience}</p>
              </div>

              <div className="detail-section">
                <h4>Matching Skills</h4>
                <div className="skills-row">
                  {selectedMatch.matchedSkills.map((skill, i) => (
                    <span key={i} className="skill-tag matched">{skill} ✓</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>All Skills</h4>
                <div className="skills-row">
                  {selectedMatch.student.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className={`skill-tag ${selectedMatch.matchedSkills.includes(skill) ? "matched" : ""}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-actions">
                <button className="button" onClick={() => handleApprove(selectedMatch)}>
                  Accept for {selectedMatch.internship.title}
                </button>
                <button className="button secondary" onClick={() => handleReject(selectedMatch.id)}>
                  Pass
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
