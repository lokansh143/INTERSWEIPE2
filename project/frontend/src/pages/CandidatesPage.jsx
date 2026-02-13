import { useState } from "react";

const API_BASE = "http://localhost:5000/api";

const candidates = [
  {
    id: 1,
    name: "Ava Patel",
    major: "Computer Science",
    university: "San Jose State University",
    location: "San Jose, CA",
    grad: "2026",
    gpa: "3.7",
    availability: "Summer 2026",
    match: 88,
    headline: "Full-stack builder focused on web platforms",
    experience: "Built a campus events app with 5k users",
    skills: ["React", "Node.js", "APIs", "MongoDB"],
    status: "pending"
  },
  {
    id: 2,
    name: "Liam Chen",
    major: "Data Science",
    university: "Columbia University",
    location: "New York, NY",
    grad: "2025",
    gpa: "3.8",
    availability: "Spring 2025",
    match: 84,
    headline: "Analytics intern with strong storytelling",
    experience: "Dashboarded retail KPIs across 12 stores",
    skills: ["Python", "SQL", "Tableau", "Pandas"],
    status: "pending"
  },
  {
    id: 3,
    name: "Mia Rodriguez",
    major: "Product Design",
    university: "UT Austin",
    location: "Austin, TX",
    grad: "2026",
    gpa: "3.6",
    availability: "Summer 2026",
    match: 81,
    headline: "UX designer who ships fast iterations",
    experience: "Designed onboarding for a healthtech startup",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems"],
    status: "pending"
  },
  {
    id: 4,
    name: "Noah Kim",
    major: "Cybersecurity",
    university: "George Mason University",
    location: "Arlington, VA",
    grad: "2025",
    gpa: "3.5",
    availability: "Fall 2025",
    match: 79,
    headline: "Blue-team focused, loves incident response",
    experience: "Ran tabletop exercises for SOC workflows",
    skills: ["SIEM", "Networking", "Incident Response", "Python"],
    status: "pending"
  },
  {
    id: 5,
    name: "Ella Johnson",
    major: "Marketing",
    university: "UCLA",
    location: "Remote",
    grad: "2026",
    gpa: "3.9",
    availability: "Summer 2026",
    match: 76,
    headline: "Growth marketer with social campaign wins",
    experience: "Lifted conversions 18% via email nurture",
    skills: ["Analytics", "SEO", "Campaigns", "Copywriting"],
    status: "pending"
  },
  {
    id: 6,
    name: "Ethan Brooks",
    major: "Business Analytics",
    university: "University of Illinois",
    location: "Chicago, IL",
    grad: "2025",
    gpa: "3.4",
    availability: "Spring 2025",
    match: 74,
    headline: "Process-minded analyst with ops focus",
    experience: "Mapped supply chain workflows for savings",
    skills: ["Excel", "Process Mapping", "Stakeholder Mgmt", "Power BI"],
    status: "pending"
  },
  {
    id: 7,
    name: "Sophia Nguyen",
    major: "Software Engineering",
    university: "Carnegie Mellon",
    location: "Pittsburgh, PA",
    grad: "2025",
    gpa: "3.9",
    availability: "Summer 2025",
    match: 90,
    headline: "Backend engineer who optimizes APIs",
    experience: "Reduced latency 30% in microservices",
    skills: ["Java", "Spring", "PostgreSQL", "AWS"],
    status: "pending"
  },
  {
    id: 8,
    name: "Arjun Mehta",
    major: "Finance",
    university: "NYU Stern",
    location: "Boston, MA",
    grad: "2026",
    gpa: "3.7",
    availability: "Summer 2026",
    match: 72,
    headline: "Finance intern with modeling experience",
    experience: "Built valuation comps for fintech projects",
    skills: ["Modeling", "Forecasting", "Excel", "PowerPoint"],
    status: "pending"
  },
  {
    id: 9,
    name: "Zoe Carter",
    major: "Human Resources",
    university: "Ohio State",
    location: "Remote",
    grad: "2025",
    gpa: "3.6",
    availability: "Fall 2025",
    match: 70,
    headline: "People ops intern who loves onboarding",
    experience: "Coordinated 60+ hires for a retail chain",
    skills: ["Onboarding", "HRIS", "Scheduling", "Documentation"],
    status: "pending"
  },
  {
    id: 10,
    name: "Daniel Okafor",
    major: "AI Research",
    university: "Stanford University",
    location: "San Francisco, CA",
    grad: "2026",
    gpa: "3.8",
    availability: "Summer 2026",
    match: 92,
    headline: "ML researcher focused on NLP models",
    experience: "Published poster on summarization metrics",
    skills: ["PyTorch", "NLP", "Experimentation", "Python"],
    status: "pending"
  }
];

export default function CandidatesPage() {
  const [students, setStudents] = useState(candidates);
  const [approving, setApproving] = useState(null);

  const updateStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const handleApprove = async (student) => {
    setApproving(student.id);
    try {
      // Create a match record in the backend with status "accepted"
      const res = await fetch(`${API_BASE}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: `student-${student.id}`,
          studentName: student.name,
          studentEmail: `${student.name.toLowerCase().replace(" ", ".")}@${student.university.toLowerCase().replace(/\s+/g, "")}.edu`,
          studentSkills: student.skills,
          internshipId: "default",
          internshipTitle: `${student.major} Internship`,
          company: "Your Company",
          recruiterId: "current-user",
          score: student.match
        })
      });

      if (res.ok) {
        // Update status to accepted after saving to backend
        const data = await res.json();
        // Now update the match status to accepted
        await fetch(`${API_BASE}/matches/${data.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" })
        });
        updateStatus(student.id, "approved");
      }
    } catch (err) {
      console.error("Failed to approve student:", err);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = (id) => {
    updateStatus(id, "rejected");
  };

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h2>Student Profiles</h2>
          <p className="muted">Review top student profiles and start outreach.</p>
        </div>
        <div className="page-actions">
          <button className="button secondary" type="button">Filter</button>
          <button className="button" type="button">Invite to interview</button>
        </div>
      </div>
      <div className="profile-grid">
        {students.map((student) => (
          <article className="profile-card" key={student.id}>
            <div className="profile-header">
              <div>
                <h3>{student.name}</h3>
                <p className="muted">
                  {student.major} · {student.university} · {student.location}
                </p>
              </div>
              <div className="status-tags">
                <span className="tag accent">{student.match}% match</span>
                <span className={`tag status ${student.status}`}>
                  {student.status}
                </span>
              </div>
            </div>
            <p className="muted">
              Graduation: {student.grad} · GPA: {student.gpa} · {student.availability}
            </p>
            <p className="muted">{student.headline}</p>
            <p className="muted">Recent work: {student.experience}</p>
            <div className="chip-row">
              {student.skills.map((skill) => (
                <span className="chip" key={skill}>{skill}</span>
              ))}
            </div>
            <div className="profile-actions">
              <button className="button secondary" type="button">View profile</button>
              <button
                className="button secondary"
                type="button"
                onClick={() => handleReject(student.id)}
                disabled={student.status !== "pending"}
              >
                Reject
              </button>
              <button
                className="button"
                type="button"
                onClick={() => handleApprove(student)}
                disabled={student.status !== "pending" || approving === student.id}
              >
                {approving === student.id ? "Approving..." : student.status === "approved" ? "Approved" : "Approve"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
