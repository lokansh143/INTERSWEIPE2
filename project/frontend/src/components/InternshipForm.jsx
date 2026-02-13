import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function InternshipForm({ onSuccess, onCancel, editData }) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    company: editData?.company || "",
    location: editData?.location || "",
    stipend: editData?.stipend || "",
    skills: editData?.skills?.join(", ") || "",
    description: editData?.description || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        recruiterId: "current-user" // In a real app, get from auth context
      };

      const url = editData?.id 
        ? `${API_BASE}/internships/${editData.id}`
        : `${API_BASE}/internships`;
      
      const method = editData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save internship");
      }

      const saved = await res.json();
      onSuccess?.(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internship-form-overlay">
      <form className="internship-form card" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>{editData ? "Edit Internship" : "Create New Swipe Card"}</h3>
          <button type="button" className="close-btn" onClick={onCancel}>×</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Software Engineering Intern"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name *</label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g., Acme Corp"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Remote, New York, NY"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stipend">Stipend</label>
            <input
              id="stipend"
              name="stipend"
              type="text"
              value={form.stipend}
              onChange={handleChange}
              placeholder="e.g., $1,500 / mo"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="skills">Required Skills (comma-separated)</label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Python"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the internship role, responsibilities, and what you're looking for..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Saving..." : (editData ? "Update Card" : "Create Swipe Card")}
          </button>
        </div>
      </form>
    </div>
  );
}
