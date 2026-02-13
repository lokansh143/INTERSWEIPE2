import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function AcceptedStudentsPage() {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchAcceptedStudents();
  }, []);

  const fetchAcceptedStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/matches/accepted`);
      const data = await res.json();
      setAcceptedStudents(data.acceptedStudents || []);
    } catch (err) {
      console.error("Failed to fetch accepted students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this student from accepted list?")) return;
    try {
      await fetch(`${API_BASE}/matches/${id}`, { method: "DELETE" });
      fetchAcceptedStudents();
      if (selectedStudent?.id === id) setSelectedStudent(null);
    } catch (err) {
      console.error("Failed to remove:", err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/matches/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchAcceptedStudents();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h2>Accepted Students</h2>
          <p className="muted">Students who have been accepted for your internship positions.</p>
        </div>
        <div className="page-actions">
          <span className="tag accent">{acceptedStudents.length} accepted</span>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading accepted students...</p>
      ) : acceptedStudents.length === 0 ? (
        <div className="empty-state">
          <h3>No accepted students yet</h3>
          <p className="muted">Once you accept candidates from the Students page, they will appear here.</p>
        </div>
      ) : (
        <div className="accepted-students-layout">
          <div className="students-list">
            {acceptedStudents.map((student) => (
              <div 
                key={student.id} 
                className={`student-card ${selectedStudent?.id === student.id ? "selected" : ""}`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="student-card-avatar">
                  {student.studentName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="student-card-info">
                  <h4>{student.studentName}</h4>
                  <p className="muted">{student.internshipTitle}</p>
                  <span className="tag success">Accepted</span>
                </div>
                <div className="student-card-score">
                  <strong>{student.score}%</strong>
                  <span className="muted">match</span>
                </div>
              </div>
            ))}
          </div>

          {selectedStudent && (
            <div className="student-profile-detail">
              <div className="profile-header-section">
                <div className="profile-avatar-large">
                  {selectedStudent.studentName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h3>{selectedStudent.studentName}</h3>
                  <p className="muted">{selectedStudent.studentEmail}</p>
                </div>
              </div>

              <div className="profile-section">
                <h4>Accepted For</h4>
                <div className="accepted-role">
                  <strong>{selectedStudent.internshipTitle}</strong>
                  <span className="muted">{selectedStudent.company}</span>
                </div>
              </div>

              <div className="profile-section">
                <h4>Match Score</h4>
                <div className="match-score-display">
                  <div className="score-circle">
                    <span className="score-value">{selectedStudent.score}%</span>
                  </div>
                  <p className="muted">AI-calculated compatibility score</p>
                </div>
              </div>

              <div className="profile-section">
                <h4>Skills</h4>
                <div className="skills-row">
                  {(selectedStudent.studentSkills || []).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h4>Accepted Date</h4>
                <p className="muted">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="profile-actions-section">
                <button className="button" onClick={() => window.location.href = `/chat?student=${selectedStudent.studentId}`}>
                  Message Student
                </button>
                <button className="button secondary" onClick={() => handleUpdateStatus(selectedStudent.id, "rejected")}>
                  Revoke Acceptance
                </button>
                <button className="button danger" onClick={() => handleRemove(selectedStudent.id)}>
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
