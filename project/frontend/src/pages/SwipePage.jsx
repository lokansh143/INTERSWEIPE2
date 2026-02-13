import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "http://localhost:5000/api";

// Fallback internships if API is unavailable
const fallbackInternships = [
  {
    id: 1,
    title: "Product Design Intern",
    company: "Northwind Labs",
    location: "Remote",
    stipend: "$1,200 / mo",
    match: 82,
    skills: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "Lumen Metrics",
    location: "New York, NY",
    stipend: "$1,500 / mo",
    match: 78,
    skills: ["SQL", "Python", "Tableau"]
  },
  {
    id: 3,
    title: "Software Engineering Intern",
    company: "Apex Systems",
    location: "Austin, TX",
    stipend: "$1,800 / mo",
    match: 75,
    skills: ["React", "Node.js", "APIs"]
  }
];

export default function SwipePage() {
  const [allInternships, setAllInternships] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [liked, setLiked] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "all",
    minMatch: 0,
    skills: ""
  });
  const startX = useRef(0);

  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/internships`);
      const data = await res.json();
      const fetched = data.internships || [];
      // Add random match percentage for demo
      const withMatch = fetched.map(i => ({ ...i, match: i.match || Math.floor(Math.random() * 30) + 65 }));
      const result = withMatch.length > 0 ? withMatch : fallbackInternships;
      setAllInternships(result);
      return result;
    } catch (err) {
      console.error("Failed to fetch internships:", err);
      setAllInternships(fallbackInternships);
      return fallbackInternships;
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];

    // Filter by location
    if (filters.location !== "all") {
      if (filters.location === "remote") {
        filtered = filtered.filter(i => i.location?.toLowerCase().includes("remote"));
      } else if (filters.location === "onsite") {
        filtered = filtered.filter(i => !i.location?.toLowerCase().includes("remote"));
      }
    }

    // Filter by minimum match score
    if (filters.minMatch > 0) {
      filtered = filtered.filter(i => (i.match || 0) >= filters.minMatch);
    }

    // Filter by skills
    if (filters.skills.trim()) {
      const skillsToMatch = filters.skills.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
      filtered = filtered.filter(i => {
        const internshipSkills = (i.skills || []).map(s => s.toLowerCase());
        return skillsToMatch.some(skill => 
          internshipSkills.some(is => is.includes(skill) || skill.includes(is))
        );
      });
    }

    // Exclude already swiped
    const likedIds = new Set(liked.map(l => l.id));
    const rejectedIds = new Set(rejected.map(r => r.id));
    filtered = filtered.filter(i => !likedIds.has(i.id) && !rejectedIds.has(i.id));

    setInternships(filtered);
    setIndex(0);
  };

  useEffect(() => {
    const init = async () => {
      const data = await fetchInternships();
      applyFilters(data);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (allInternships.length > 0) {
      applyFilters(allInternships);
    }
  }, [filters, liked, rejected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setIndex(0);
    setLiked([]);
    setRejected([]);
    const data = await fetchInternships();
    applyFilters(data);
    setRefreshing(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: "all", minMatch: 0, skills: "" });
  };

  const hasActiveFilters = filters.location !== "all" || filters.minMatch > 0 || filters.skills.trim() !== "";

  const locations = useMemo(() => {
    const locs = new Set(allInternships.map(i => i.location).filter(Boolean));
    return Array.from(locs);
  }, [allInternships]);

  const current = useMemo(() => internships[index], [internships, index]);
  const next = useMemo(() => internships[index + 1], [internships, index]);

  const resetDrag = () => {
    setDragX(0);
    setIsDragging(false);
  };

  const advanceCard = () => {
    setIndex((prev) => Math.min(prev + 1, internships.length));
    resetDrag();
  };

  const handleDecision = (direction) => {
    if (!current) {
      return;
    }
    if (direction === "like") {
      setLiked((prev) => [current, ...prev]);
    } else {
      setRejected((prev) => [current, ...prev]);
    }
    advanceCard();
  };

  const handlePointerDown = (event) => {
    setIsDragging(true);
    startX.current = event.clientX;
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }
    setDragX(event.clientX - startX.current);
  };

  const handlePointerUp = () => {
    if (Math.abs(dragX) > 120) {
      handleDecision(dragX > 0 ? "like" : "reject");
      return;
    }
    resetDrag();
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(prev => prev - 1);
      resetDrag();
    }
  };

  const handleNext = () => {
    if (index < internships.length - 1) {
      setIndex(prev => prev + 1);
      resetDrag();
    }
  };

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h2>Swipe internships</h2>
          <p className="muted">Swipe left to reject, right to like.</p>
        </div>
        <div className="page-actions">
          <button 
            className={`button secondary ${hasActiveFilters ? "active" : ""}`} 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {hasActiveFilters ? "Filters ✓" : "Filters"}
          </button>
          <button 
            className="button" 
            type="button" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh matches"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Location</label>
              <select 
                value={filters.location} 
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site Only</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Match %</label>
              <select 
                value={filters.minMatch} 
                onChange={(e) => handleFilterChange("minMatch", parseInt(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={50}>50%+</option>
                <option value={60}>60%+</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
              </select>
            </div>

            <div className="filter-group flex-grow">
              <label>Skills (comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g., React, Python, SQL"
                value={filters.skills}
                onChange={(e) => handleFilterChange("skills", e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <span className="muted">{internships.length} internships match your filters</span>
            {hasActiveFilters && (
              <button className="button secondary small" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p className="muted">Loading internships...</p>
        </div>
      ) : (
      <div className="swipe-layout">
        <div className="swipe-stage">
          {next && (
            <article className="swipe-card preview" aria-hidden="true">
              <div className="swipe-header">
                <div>
                  <h3>{next.title}</h3>
                  <p className="muted">{next.company} · {next.location}</p>
                </div>
                <span className="tag accent">{next.match}% match</span>
              </div>
              <p className="muted">Stipend: {next.stipend}</p>
              <div className="chip-row">
                {(next.skills || []).map((skill) => (
                  <span className="chip" key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          )}
          {current ? (
            <article
              className="swipe-card active"
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <div className="swipe-header">
                <div>
                  <h3>{current.title}</h3>
                  <p className="muted">{current.company} · {current.location}</p>
                </div>
                <span className="tag accent">{current.match}% match</span>
              </div>
              <p className="muted">Stipend: {current.stipend}</p>
              <div className="chip-row">
                {(current.skills || []).map((skill) => (
                  <span className="chip" key={skill}>{skill}</span>
                ))}
              </div>
              <div className="swipe-navigation">
                <button 
                  className="nav-button" 
                  type="button" 
                  onClick={handlePrev}
                  disabled={index === 0}
                >
                  ← Prev
                </button>
                <span className="card-counter">{index + 1} / {internships.length}</span>
                <button 
                  className="nav-button" 
                  type="button" 
                  onClick={handleNext}
                  disabled={index === internships.length - 1}
                >
                  Next →
                </button>
              </div>
              <div className="swipe-actions">
                <button className="button secondary" type="button" onClick={() => handleDecision("reject")}>
                  Reject
                </button>
                <button className="button" type="button" onClick={() => handleDecision("like")}>
                  Like
                </button>
              </div>
            </article>
          ) : (
            <div className="empty-state">
              <h3>All caught up</h3>
              <p className="muted">You have swiped through all available roles.</p>
            </div>
          )}
        </div>
        <aside className="swipe-history">
          <div className="history-block">
            <h3>Liked</h3>
            {liked.length === 0 ? (
              <p className="muted">No likes yet.</p>
            ) : (
              <ul>
                {liked.slice(0, 5).map((item) => (
                  <li key={`like-${item.id}`}>
                    <strong>{item.title}</strong>
                    <span className="muted">{item.company}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="history-block">
            <h3>Rejected</h3>
            {rejected.length === 0 ? (
              <p className="muted">No rejections yet.</p>
            ) : (
              <ul>
                {rejected.slice(0, 5).map((item) => (
                  <li key={`reject-${item.id}`}>
                    <strong>{item.title}</strong>
                    <span className="muted">{item.company}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
      )}
    </section>
  );
}
