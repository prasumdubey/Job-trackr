import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import illustration from "../assets/Signup.svg";
import { signupUser } from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    highestQualification: "",
    password: "",
    confirmPassword: "",
    profile_pic: null,
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_pic") {
      if (files[0] && !["image/jpeg", "image/png"].includes(files[0].type)) {
        alert("Profile picture must be a JPG or PNG file.");
        return;
      }
      setFormData((prev) => ({ ...prev, profile_pic: files[0] }));
    }
    else if (name === "resume") {
      if (files[0] && !["application/pdf"].includes(files[0].type)) {
        alert("Resume must be a PDF file.");
        return;
      }
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    }  
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Prepare FormData
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      // Call API
      const response = await signupUser(data);

      if (response?.success) {
        alert(response.message || "User registered successfully!");
        navigate("/login"); // redirect to login
      } else {
        // Specific backend errors for duplicates
        if (response?.message.includes("Email")) {
          alert("This email is already registered!");
        } else if (response?.message.includes("Username")) {
          alert("This username is already taken!");
        } else {
          alert(response?.message || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // Show server-side error message if exists
      const msg = error?.message || error?.error || "Signup failed. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="input-form-page">
      <div className="form-illustration">
        <img src={illustration} alt="Signup Illustration" />
      </div>
      <div className="input-form-container">
        <div className="title-container">
          <h2>Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="highestQualification & Institute">
              Highest Qualification (e.g., Bachelor of Technology, Galgotias University)
            </label>
            <input
              type="text"
              name="highestQualification"
              placeholder="Enter your qualification"
              value={formData.highestQualification}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture (JPG/PNG)</label>
            <input
              type="file"
              name="profile_pic"
              accept=".jpg, .jpeg, .png"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume (PDF)</label>
            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="btn-row">
            <button type="reset" className="reset-btn">Reset</button>
            <button type="submit" className="submit-btn">Sign Up</button>
          </div>
        </form>
        <p className="redirect-text">
          Already have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
