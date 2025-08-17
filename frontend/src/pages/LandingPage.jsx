import { useNavigate } from "react-router-dom"; 
import illustration from "../assets/JobLanding.svg";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="first-page">

      <section className="hero">
        <div className="hero-text">
          <h2>Track your Job applications effectively!</h2>
          <p>
            <strong>Your personal dashboard to store and manage all job applications</strong>
            <br></br>keep details, salaries, and statuses at your fingertips.
          </p>
          <button className="cta-button" onClick={() => navigate("/login")}>Track Jobs</button>
        </div>
        <div className="hero-image">
          <img src={illustration} alt="Girl Reading" />
        </div>
      </section>
    </div>
  );
};


export default LandingPage;

