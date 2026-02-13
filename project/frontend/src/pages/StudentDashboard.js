export default function StudentDashboard() {
  return (
    <section className="card">
      <h2>Student Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Applications</h3>
          <span className="tag">0 active</span>
        </div>
        <div className="card">
          <h3>Matches</h3>
          <span className="tag">0 new</span>
        </div>
      </div>
    </section>
  );
}
