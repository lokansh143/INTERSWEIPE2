import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <section className="card">
      <h2>Welcome back</h2>
      <p>Sign in to access your internship matches.</p>
      <button type="button" onClick={() => login({ name: "Student" })}>
        Continue as demo user
      </button>
    </section>
  );
}
