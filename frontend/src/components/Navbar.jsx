import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";
import profileImage from "../assets/profile.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      setIsOpen(false);
      navigate("/login");  // Close hamburger if open
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand"><Link to="/" onClick={() => setIsOpen(false)}>JobTrackr</Link></div>
      

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <nav className={`nav-links ${isOpen ? "active" : ""}`}>  
        <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>

        {!isLoggedIn && (
          <>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        )}

        {isLoggedIn && ( 
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/edit">Edit Profile</Link>
            <span
              onClick={handleLogout}
              className="logout-link"
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>

          </>
        )}

        <img src={profileImage} alt="profile" />
      </nav>
    </header>
  );
};

export default Navbar;
