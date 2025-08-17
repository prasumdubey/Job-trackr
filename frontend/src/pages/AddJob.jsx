import { useState } from "react";
import axios from "axios";
import "./AddJob.css";
import { BASE_URL, getToken } from "../api/axios";


export default function AddJob() {
  const [mode, setMode] = useState("manual"); // manual | file
  const [description, setDescription] = useState("");
  const [jobData, setJobData] = useState({
    companyName: "",
    jobRole: "",
    jobType: "",
    location: "",
    salary: "",
    probationPeriod: "",
    fullTimeOpportunity: "",
  });
  const [jobFile, setJobFile] = useState(null);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setJobFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "manual") {
        await axios.post(`${BASE_URL}/jobs/add`, jobData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
      } else {
        const formData = new FormData();
        if (jobFile) formData.append("file", jobFile);
        if (description) formData.append("jobDescription", description);

        await axios.post(`${BASE_URL}/jobs/extract`, formData, {
          headers: { 
            Authorization: `Bearer ${getToken()}`,
          },
        });
      }
      alert("Job added successfully!");
      setJobData({
        companyName: "",
        jobRole: "",
        jobType: "",
        location: "",
        salary: "",
        probationPeriod: "",
        fullTimeOpportunity: "",
      });
      setJobFile(null);
    } catch (error) {
      console.error(error);
      alert("Error adding job");
    }
  };

  return (
    <div className="login-page">
      <div className="input-form-page" >
        <div className="input-form-container">
          <div className="title-container">
            <h2>Add Job</h2>
          </div>

          <div className="mode-switch">
            <button
              type="button"
              className={mode === "manual" ? "active" : ""}
              onClick={() => setMode("manual")}
            >
              Manual Entry
            </button>
            <button
              type="button"
              className={mode === "file" ? "active" : ""}
              onClick={() => setMode("file")}
            >
              File / Description
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "manual" ? (
              <div className="manual-form">
                <div>
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={jobData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Job Role</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={jobData.jobRole}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Job Type</label>
                  <input
                    type="text"
                    name="jobType"
                    value={jobData.jobType}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobData.salary}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Probation Period</label>
                  <input
                    type="text"
                    name="probationPeriod"
                    value={jobData.probationPeriod}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Full Time Opportunity</label>
                  <input
                    type="text"
                    name="fullTimeOpportunity"
                    value={jobData.fullTimeOpportunity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label>Upload Job File</label>
                  <input type="file" onChange={handleFileChange} />
                </div>
                <div>
                  <label>Or Paste Job Description</label><br></br>
                  <textarea
                    value={description}
                    class="job-description"
                    placeholder="Paste job description here..."
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                  />
                </div>
              </>
            )}


            <div className="btn-row">
              <button
                type="reset"
                className="reset-btn"
                onClick={() =>
                  setJobData({
                    companyName: "",
                    jobRole: "",
                    jobType: "",
                    location: "",
                    salary: "",
                    probationPeriod: "",
                    fullTimeOpportunity: "",
                  })
                }
              >
                Reset
              </button>
              <button type="submit" className="submit-btn">
                Add Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
