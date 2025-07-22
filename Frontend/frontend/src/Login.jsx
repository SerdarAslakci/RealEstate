import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post("http://localhost:5250/api/Auth/Login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setErrorMsg("Login failed, please check your credentials.");
      }
    } catch (error) {
      setErrorMsg("An error occurred during login. Please try again.");
    }
    setLoading(false);
  };

  const backgroundStyle = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    position: "relative",
    paddingTop: "80px", // Navbar ile araya boşluk
    paddingBottom: "40px",
    borderRadius: "6px"
  };

  return (
    <div className="container-fluid w-90 px-3" style={{ overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-dark shadow-sm rounded-bottom">
        <div className="container-fluid px-5  ">
          <Link className="navbar-brand text-white fw-bold fs-2" to="/">
            🏠︎
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/ExploreHomes">
                  Homes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Register">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Navbar ile hero section arasında beyaz boşluk */}
      <div style={{ height: "48px", backgroundColor: "#fff" }}></div>

      {/* Background and Form */}
      <div style={backgroundStyle}>
        {/* Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{opacity: 0.75,borderRadius: "6px"}}></div>
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: "100%", zIndex: 2, position: "relative" }}
        >
          <div
            className="card p-5 rounded-4 shadow-lg w-100"
            style={{
              maxWidth: "420px",
              backgroundColor: "rgba(30, 30, 30, 0.85)",
              color: "white",
            }}
          >
            <h2 className="mb-4 text-center fw-bold" style={{ color: "#aad8d3" }}>
              Real Estate Panel Login
            </h2>

            {errorMsg && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#aad8d3" }}>
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      border: "none",
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#aad8d3" }}>
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      border: "none",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="d-flex justify-content-between mt-3">
              <Link to="/register" className="text-success fw-semibold" style={{ textDecoration: "none" }}>
                Register
              </Link>
              <Link to="/forgot-password" className="text-success fw-semibold" style={{ textDecoration: "none" }}>
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center rounded-top" style={{marginTop: "48px"}}>
        <div className="container">
          <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default Login;
