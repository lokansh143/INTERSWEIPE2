import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const API_BASE = "http://localhost:5000/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    major: "",
    university: "",
    location: "",
    graduationYear: "",
    gpa: "",
    availability: "",
    headline: "",
    bio: "",
    skills: "",
    experience: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    resumeUploaded: false
  });

  useEffect(() => {
    // Load saved profile from localStorage (in production, fetch from API)
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem("studentProfile", JSON.stringify(profile));
      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
    setEditing(false);
  };

  const calculateProfileCompletion = () => {
    const fields = [profile.name, profile.email, profile.major, profile.university, 
                    profile.graduationYear, profile.skills, profile.headline, profile.bio];
    const filled = fields.filter(f => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateProfileCompletion();

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p className="muted">Manage your information to get better internship matches.</p>
        </div>
        <div className="page-actions">
          {editing ? (
            <>
              <button className="button secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button className="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </>
          ) : (
            <button className="button" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-completion">
        <div className="completion-header">
          <span>Profile Completion</span>
          <strong>{completion}%</strong>
        </div>
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${completion}%` }}></div>
        </div>
        {completion < 100 && (
          <p className="muted completion-hint">Complete your profile to improve your match score!</p>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {/* Basic Info Section */}
          <div className="profile-section-card">
            <h3>Basic Information</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="profile-value">{profile.name || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="your.email@university.edu"
                  />
                ) : (
                  <p className="profile-value">{profile.email || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="profile-value">{profile.phone || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>Location</label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                ) : (
                  <p className="profile-value">{profile.location || <span className="muted">Not set</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="profile-section-card">
            <h3>Education</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>University</label>
                {editing ? (
                  <input
                    type="text"
                    name="university"
                    value={profile.university}
                    onChange={handleChange}
                    placeholder="Your university"
                  />
                ) : (
                  <p className="profile-value">{profile.university || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>Major</label>
                {editing ? (
                  <input
                    type="text"
                    name="major"
                    value={profile.major}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                ) : (
                  <p className="profile-value">{profile.major || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>Graduation Year</label>
                {editing ? (
                  <select name="graduationYear" value={profile.graduationYear} onChange={handleChange}>
                    <option value="">Select year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                ) : (
                  <p className="profile-value">{profile.graduationYear || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group">
                <label>GPA</label>
                {editing ? (
                  <input
                    type="text"
                    name="gpa"
                    value={profile.gpa}
                    onChange={handleChange}
                    placeholder="e.g., 3.7"
                  />
                ) : (
                  <p className="profile-value">{profile.gpa || <span className="muted">Not set</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="profile-section-card">
            <h3>About You</h3>
            <div className="profile-form-grid">
              <div className="form-group full-width">
                <label>Headline</label>
                {editing ? (
                  <input
                    type="text"
                    name="headline"
                    value={profile.headline}
                    onChange={handleChange}
                    placeholder="e.g., Full-stack developer passionate about AI"
                  />
                ) : (
                  <p className="profile-value">{profile.headline || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Bio</label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell recruiters about yourself, your interests, and what you're looking for..."
                    rows={4}
                  />
                ) : (
                  <p className="profile-value">{profile.bio || <span className="muted">Not set</span>}</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Availability</label>
                {editing ? (
                  <select name="availability" value={profile.availability} onChange={handleChange}>
                    <option value="">Select availability</option>
                    <option value="Summer 2026">Summer 2026</option>
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                ) : (
                  <p className="profile-value">{profile.availability || <span className="muted">Not set</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="profile-section-card">
            <h3>Skills & Experience</h3>
            <div className="profile-form-grid">
              <div className="form-group full-width">
                <label>Skills (comma-separated)</label>
                {editing ? (
                  <input
                    type="text"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, Python, SQL, Figma"
                  />
                ) : profile.skills ? (
                  <div className="skills-row">
                    {profile.skills.split(",").map((skill, i) => (
                      <span key={i} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No skills added</p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Experience Highlights</label>
                {editing ? (
                  <textarea
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="Describe your relevant projects, internships, or work experience..."
                    rows={3}
                  />
                ) : (
                  <p className="profile-value">{profile.experience || <span className="muted">Not set</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="profile-section-card">
            <h3>Links & Portfolio</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>LinkedIn</label>
                {editing ? (
                  <input
                    type="url"
                    name="linkedIn"
                    value={profile.linkedIn}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <p className="profile-value">
                    {profile.linkedIn ? (
                      <a href={profile.linkedIn} target="_blank" rel="noreferrer">{profile.linkedIn}</a>
                    ) : (
                      <span className="muted">Not set</span>
                    )}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>GitHub</label>
                {editing ? (
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                ) : (
                  <p className="profile-value">
                    {profile.github ? (
                      <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a>
                    ) : (
                      <span className="muted">Not set</span>
                    )}
                  </p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Portfolio Website</label>
                {editing ? (
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />
                ) : (
                  <p className="profile-value">
                    {profile.portfolio ? (
                      <a href={profile.portfolio} target="_blank" rel="noreferrer">{profile.portfolio}</a>
                    ) : (
                      <span className="muted">Not set</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-preview-card">
            <div className="preview-avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </div>
            <h4>{profile.name || "Your Name"}</h4>
            <p className="muted">{profile.headline || "Your headline"}</p>
            <p className="muted">{profile.university || "University"}</p>
            {profile.skills && (
              <div className="preview-skills">
                {profile.skills.split(",").slice(0, 4).map((skill, i) => (
                  <span key={i} className="chip small">{skill.trim()}</span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-tips">
            <h4>Profile Tips</h4>
            <ul>
              <li>Add at least 5 skills for better matches</li>
              <li>Include a compelling headline</li>
              <li>Describe your projects and experience</li>
              <li>Link your GitHub and LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
