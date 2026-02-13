import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after registration
      login({ user: data.user, token: data.token });
      
      // Navigate based on role
      if (data.user.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-panel">
        <span className="tag accent">Create profile</span>
        <h3>Build your InternSwipe profile</h3>
        <p className="muted">
          Choose your role to unlock tailored recommendations.
        </p>
        <ul className="feature-list">
          <li>Students get curated matches</li>
          <li>Recruiters see ranked candidates</li>
          <li>All activity tracked in one dashboard</li>
        </ul>
      </div>
      <div className="card auth-card">
        <h2>Create your profile</h2>
        <p>Join InternSwipe to get matched faster.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Full name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </label>
          <label className="field">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
            />
          </label>
          <label className="field">
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link className="link" to="/">Sign in</Link>.
        </p>
      </div>
    </section>
  );
}
