import { useEffect, useState } from "react";
import InternshipForm from "../components/InternshipForm";

const API_BASE = "http://localhost:5000/api";

export default function RecruiterDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [interestList, setInterestList] = useState([]);
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestError, setInterestError] = useState("");

  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/internships`);
      const data = await res.json();
      setInternships(data.internships || []);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (selectedInternship && !internships.find((role) => role.id === selectedInternship.id)) {
      setSelectedInternship(null);
      setInterestList([]);
      setInterestError("");
    }
  }, [internships, selectedInternship]);

  const handleCreateClick = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEditClick = (internship) => {
    setEditData(internship);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditData(null);
    fetchInternships();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this swipe card?")) return;
    try {
      await fetch(`${API_BASE}/internships/${id}`, { method: "DELETE" });
      fetchInternships();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleCardSelect = (internship) => {
    if (selectedInternship?.id === internship.id) {
      setSelectedInternship(null);
      setInterestList([]);
      setInterestError("");
      return;
    }

    setSelectedInternship(internship);
    setInterestList([]);
    setInterestError("");
    setInterestLoading(true);

    fetch(`${API_BASE}/swipes/likes/${internship.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load interested students");
        }
        return res.json();
      })
      .then((data) => {
        setInterestList(data.likes || []);
      })
      .catch((err) => {
        setInterestError(err.message || "Unable to load interested students");
      })
      .finally(() => {
        setInterestLoading(false);
      });
  };

  return (
    <section className="card dashboard-container">
      <div className="page-header">
        <div>
          <p className="welcome-text">Welcome back! 👋</p>
          <h2>Recruiter Dashboard</h2>
          <p className="muted">Manage postings, review talent, and track outreach.</p>
        </div>
        <div className="page-actions">
          <button className="button" type="button" onClick={handleCreateClick}>
            + Create Swipe Card
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <h4>Open roles</h4>
          <strong>{internships.length}</strong>
        </div>
        <div className="stat">
          <h4>Shortlisted</h4>
          <strong>0</strong>
        </div>
        <div className="stat">
          <h4>Messages sent</h4>
          <strong>0</strong>
        </div>
      </div>

      {/* Swipe Cards Management Section */}
      <div className="swipe-cards-section">
        <h3>Your Swipe Cards</h3>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : internships.length === 0 ? (
          <div className="empty-state">
            <p className="muted">No swipe cards created yet.</p>
            <button className="button" onClick={handleCreateClick}>Create Your First Card</button>
          </div>
        ) : (
          <div className="internship-list">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className={`internship-card ${selectedInternship?.id === internship.id ? "selected" : ""}`}
                onClick={() => handleCardSelect(internship)}
                role="button"
              >
                <div className="internship-card-content">
                  <div className="internship-card-header">
                    <h4>{internship.title}</h4>
                    <span className="tag">{internship.location}</span>
                  </div>
                  <p className="company-name">{internship.company}</p>
                  {internship.stipend && <p className="stipend">{internship.stipend}</p>}
                  {internship.skills?.length > 0 && (
                    <div className="skills-row">
                      {internship.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  {internship.description && (
                    <p className="description-preview">{internship.description.slice(0, 100)}{internship.description.length > 100 ? "..." : ""}</p>
                  )}
                </div>
                <div className="internship-card-actions">
                  <button
                    className="button secondary small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditClick(internship);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="button danger small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(internship.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInternship && (
        <div className="card soft likes-panel">
          <div className="page-header">
            <div>
              <h3>Interested students</h3>
              <p className="muted">{selectedInternship.title} - {selectedInternship.company}</p>
            </div>
            <span className="tag accent">{interestList.length} likes</span>
          </div>
          {interestLoading && <p className="muted">Loading interest...</p>}
          {interestError && !interestLoading && <p className="error">{interestError}</p>}
          {!interestLoading && !interestError && (
            interestList.length === 0 ? (
              <div className="empty-state">
                <h3>No likes yet</h3>
                <p className="muted">Once students swipe right on this role, you will see them here.</p>
              </div>
            ) : (
              <ul className="likes-list">
                {interestList.map((student) => {
                  const initials = (student.name || "?")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <li key={student.id} className="like-row">
                      <div className="like-avatar">{initials || "?"}</div>
                      <div className="like-info">
                        <strong>{student.name}</strong>
                        <p className="muted">{student.headline || "Student"}</p>
                        <div className="like-meta">
                          {student.location && <span>{student.location}</span>}
                          {student.skills?.length > 0 && (
                            <span>{student.skills.slice(0, 3).join(" | ")}{student.skills.length > 3 ? " +" + (student.skills.length - 3) : ""}</span>
                          )}
                        </div>
                      </div>
                      <div className="like-time">
                        <span>{student.likedAt ? new Date(student.likedAt).toLocaleString() : ""}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          )}
        </div>
      )}

      <div className="role-focus">
        <div className="card soft">
          <h3>Recruiter focus</h3>
          <ul className="feature-list">
            <li>Ranked candidate recommendations</li>
            <li>Role-specific scoring and filters</li>
            <li>Pipeline visibility by stage</li>
          </ul>
        </div>
        <div className="card soft">
          <h3>Next steps</h3>
          <ul className="feature-list">
            <li>Post your first internship role</li>
            <li>Invite top matches to interview</li>
            <li>Review engagement analytics weekly</li>
          </ul>
        </div>
      </div>

      {showForm && (
        <InternshipForm
          editData={editData}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditData(null); }}
        />
      )}
    </section>
  );
}
