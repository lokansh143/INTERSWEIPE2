import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const nextUser = data.user || { email: form.email, role: "student" };
      login({ user: nextUser, token: data.token });
      navigate(nextUser.role === "recruiter" ? "/recruiter" : "/student");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-panel">
        <span className="tag accent">Quick start</span>
        <h3>Find internships faster</h3>
        <p className="muted">
          Keep everything in one place: matching, outreach, and scheduling.
        </p>
        <ul className="feature-list">
          <li>Personalized AI match scores</li>
          <li>Saved roles and smart reminders</li>
          <li>Chat with recruiters instantly</li>
        </ul>
      </div>
      <div className="card auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to access your internship matches.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="muted">
            Student demo: demo@internswipe.com / Demo@1234
            <br />
            Recruiter demo: recruiter@internswipe.com / Recruiter@123
          </div>
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
              placeholder="••••••••"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="page-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                setForm({ email: "demo@internswipe.com", password: "Demo@1234" })
              }
              disabled={loading}
            >
              Use student demo
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                setForm({ email: "recruiter@internswipe.com", password: "Recruiter@123" })
              }
              disabled={loading}
            >
              Use recruiter demo
            </button>
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <p className="muted">
          New here? <Link className="link" to="/signup">Create an account</Link>.
        </p>
      </div>
    </section>
  );
}
