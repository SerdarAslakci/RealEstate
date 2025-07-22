import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5250/api/Auth/Register", formData);
      if (response.status === 200 || response.status === 201) {
        setSuccessMsg("Registration successful! You are being redirected to the login page.");
        setLoading(false);
        setTimeout(() => {
        navigate("/login");
        }, 2500);
      }
    } catch (err) {
      if(err.response && err.response.data != null)
      {
        setErrorMsg(err.response.data[0].description);
      }
    }

    setLoading(false);
  };

  const backgroundStyle = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1560185127-5f0d5b6fbcbb?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    filter: "brightness(0.75)",
  };

  const inputStyle = {
    backgroundColor: "#1f1f1f",
    color: "white",
    border: "none",
  };

  const fields = [
    { label: "First Name", name: "firstName", type: "text", required: true },
    { label: "Last Name", name: "lastName", type: "text", required: true },
    { label: "Age", name: "age", type: "number", required: true },
    { label: "Date of Birth", name: "dateOfBirth", type: "date", required: true },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: ["Male", "Female"],
      required: true,
    },
    { label: "National ID", name: "nationalId", type: "text", maxLength: 11 },
    { label: "Phone Number", name: "phoneNumber", type: "tel" },
    { label: "Email", name: "email", type: "email", required: true },
  ];

  return (
    <div className="container-fluid w-90 px-3" style={{ backgroundColor: "#EFF3EA" }}>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-5 mt-0 shadow-sm rounded-bottom">
        <div className="container-fluid px-5">
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

      {/* Hero Section (Yazısız ve özel div eklenebilir alan) */}
      <section
        className="d-flex vh-100 align-items-center justify-content-center position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "6px"
        }}
      >
        {/* Koyu arkaplan overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.75 ,borderRadius:"6px"}}></div>

        <div className="position-relative">
                <div style={{backgroundStyle}} className="d-flex align-items-center justify-content-center container my-3">
                    <div
                        className="card p-4 rounded-4 shadow-lg"
                        style={{
                        maxWidth: "700px",
                        width: "100%",
                        backgroundColor: "rgba(30, 30, 30, 0.9)",
                        color: "white",
                        }}
                    >
                        <h3 className="text-center fw-bold mb-4" style={{ color: "#aad8d3" }}>
                        Register
                        </h3>

                        {errorMsg && (
                        <div className="alert alert-danger text-center" role="alert">
                            {errorMsg}
                        </div>
                        )}

                        {successMsg && (
                        <div className="alert alert-success text-center" role="alert">
                            {successMsg}
                        </div>
                        )}

                        <form onSubmit={handleSubmit}>
                        <div className="row">
                            {fields.map((field, index) => (
                            <div className="mb-3 col-md-6" key={index}>
                                <label
                                htmlFor={field.name}
                                className="form-label fw-semibold d-block"
                                style={{ color: "#aad8d3" }}
                                >
                                {field.label}
                                </label>
                                {field.type === "select" ? (
                                <select
                                    name={field.name}
                                    className="form-select bg-black"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={inputStyle}
                                >
                                    <option value="">Select</option>
                                    {field.options.map((opt, idx) => (
                                    <option key={idx} value={opt}>
                                        {opt}
                                    </option>
                                    ))}
                                </select>
                                ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    className="form-control bg-black"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    maxLength={field.maxLength || undefined}
                                    style={inputStyle}
                                />
                                )}
                            </div>
                            ))}

                            {/* Password */}
                            <div className="mb-3 col-md-6">
                            <label htmlFor="password" className="form-label fw-semibold d-block" style={{ color: "#aad8d3" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-control bg-black" 
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-3 col-md-6">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold d-block" style={{ color: "#aad8d3" }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control bg-black"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success w-100 fw-semibold py-2" disabled={loading}>
                            {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Registering...
                            </>
                            ) : (
                            "Register"
                            )}
                        </button>
                        </form>

                        <div className="text-center mt-3">
                        <Link to="/login" className="text-success fw-semibold" style={{ textDecoration: "none" }}>
                            Already have an account? Login
                        </Link>
                        </div>
                    </div>
                </div>            
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center rounded-top" style={{marginTop: "48px"}}>
        <div className="container">
          <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );

}

export default Register;
