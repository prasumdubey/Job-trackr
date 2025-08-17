import { useState } from 'react';
import { loginUser } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";
import loginIllustration from "../assets/Login.svg";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginUser(email, password);

      if (res.success && res.token) {
        login(res.user,res.token);
        navigate('/dashboard');
      } else {
        throw res.message || 'Login failed';
      }
    } catch (err) {
      console.error("Login failed:", err);

      if (typeof err === 'string') setErrorMsg(err);
      else if (err.message) setErrorMsg(err.message);
      else if (err.error) setErrorMsg(err.error);
      else setErrorMsg('Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-illustration">
        <img src={loginIllustration} alt="Login Illustration" />
      </div>
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="redirect-text">
          Don't have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
