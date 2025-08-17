import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { BASE_URL } from "../api/axios";

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const jobsPerPage = 3;

  // Fetch jobs once
  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data || []);
      setFilteredJobs(res.data || []);
      setPage(1);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  // ✅ Filter jobs whenever search changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredJobs(jobs);
      setPage(1);
      return;
    }
    const query = search.toLowerCase();
    const results = jobs.filter((job) =>
      [job.jobRole, job.companyName, job.location, job.jobType, job.salary]
        .filter(Boolean) // remove undefined/null
        .some((field) => field.toLowerCase().includes(query))
    );
    setFilteredJobs(results);
    setPage(1);
  }, [search, jobs]);

  const handleViewResume = () => {
    if (!user?.resume) {
      alert("Resume unavailable");
      return;
    }
    window.open(`http://localhost:5000${user.resume}`, "_blank");
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${BASE_URL}/jobs/delete${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
      alert("Failed to delete job");
    }
  };

  // Pagination on filtered jobs
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  return (
    <div className="dashboard-page">
      <div className="profile-section">
        <img
          src={`http://localhost:5000${user?.profilePic}`}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p className="qualification"> {user?.username}  |  {user?.highestQualification} |  {user?.email}</p>
        </div>
        <div className="profile-buttons">
          <button className="edit-btn" onClick={() => navigate("/edit")}>
            Edit Profile
          </button>
          <button className="resume-btn" onClick={handleViewResume}>
            View Resume
          </button>
        </div>


      </div>

      <div className="search-section">
        <h3>My Jobs</h3>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="job-list">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job, index) => (
            <div className="job-card" key={index}>
              <div className="job-header">
                <h3>{job.jobRole}</h3>
                <p>{job.companyName}</p>
              </div>

              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💼 {job.jobType || "N/A"}</span>
              </div>

              <div className="job-footer">
                <span className="job-salary">
                  {job.salary || "Not specified"}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteJob(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-jobs">No jobs found</p>
        )}
      </div>

      {filteredJobs.length > jobsPerPage && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {Math.ceil(filteredJobs.length / jobsPerPage)}
          </span>
          <button
            disabled={page * jobsPerPage >= filteredJobs.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      <button className="add-job-btn" onClick={() => navigate("/addjob")}>
        +
      </button>
    </div>
  );
};

export default Dashboard;
