import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./Components/Navbar";


function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    phoneNumber: "",
  });
  const [email,setEmail] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [passwords, setPasswords] = useState(
    {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
  );

    const handlePasswordInput = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const clearInputs = () => 
    {
        setPasswords({currentPassword:"",newPassword:"",confirmPassword:""});
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Passwords do not match!");
            document.querySelectorAll(".passChange-inputs").forEach((element) => {
                element.value = "";
            });
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await axios.post(
            "http://localhost:5250/api/Profile/Change_Password",
            {
                oldPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            alert("Password changed successfully!");
            document.querySelectorAll(".passChange-inputs").forEach((element) => {
                element.value = "";
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
            } else {
            alert("An error occurred.");
            }
            console.error(error); 
        }
    };

  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if(token == null)
        navigate("/Login");

    axios
      .get("http://localhost:5250/api/Profile",{
        headers :
        {
            Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => {
        const data = res.data;
        const dob = data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "";
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          age: data.age || "",
          dateOfBirth: dob,
          gender: data.gender || "",
          nationalId: data.nationalId || "",
          phoneNumber: data.phoneNumber || "",
        });
        setEmail(data.email);
        setLoading(false);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/Login");
        }
        setError(err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => 
  {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    axios
      .put(
        "http://localhost:5250/api/Profile/Update_Profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSuccessMsg("Profil updated succesfully.");
      })
      .catch((err) => {
        setError(err.response?.data || err.message);
      });
  };

  if (loading)
    return (
      <div
        className="d-flex vh-100 align-items-center justify-content-center text-white"
        style={{ backgroundColor: "#212529" }}
      >
        <h3>Loading...</h3>
      </div>
    );

  return (
    <div className="container-fluid w-90 px-3" style={{ minHeight: "100vh" }}>
      {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Arka plan ve overlay */}
        <div
            className="position-relative d-flex justify-content-center align-items-start "
            style={{
                minHeight: "75vh",
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "6px",
        }}
        >
            <div
                className="container-fluid py-5"
                style={{
                    backgroundImage:
                    "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "100vh",
                }}
                >
                <div className="row justify-content-center px-3" style={{ borderRadius: "12px" }}>
                    {/* Form Column */}
                    <div className="col-lg-7 col-12 mb-lg-0 mb-4">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded p-4 shadow-lg"
                        >
                            <div className="mb-4 text-center">
                                <h2 className="fw-bold">My Profile</h2>
                                <label className="form-label text-muted">{email}</label>
                            </div>

                            {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                            )}
                            {successMsg && (
                            <div className="alert alert-success" role="alert">
                                {successMsg}
                            </div>
                            )}

                            <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="firstName" className="form-label">Name</label>
                                <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                className="form-control"
                                required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                className="form-control"
                                required
                                />
                            </div>
                            </div>

                            <div className="row mb-3">
                            <div className="col-md-4">
                                <label htmlFor="age" className="form-label">Age</label>
                                <input
                                type="number"
                                id="age"
                                name="age"
                                value={profile.age}
                                onChange={handleChange}
                                className="form-control"
                                required
                                min="0"
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="dateOfBirth" className="form-label">Date Of Birth</label>
                                <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={profile.dateOfBirth}
                                onChange={handleChange}
                                className="form-control"
                                required
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select
                                id="gender"
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className="form-select"
                                required
                                >
                                <option value="">Seçiniz</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                </select>
                            </div>
                            </div>

                            <div className="mb-3">
                            <label htmlFor="nationalId" className="form-label">
                                TC Identifier No
                            </label>
                            <input
                                type="text"
                                id="nationalId"
                                name="nationalId"
                                value={profile.nationalId}
                                onChange={handleChange}
                                className="form-control"
                                maxLength={11}
                                required
                            />
                            </div>

                            <div className="mb-4">
                            <label htmlFor="phoneNumber" className="form-label">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="05xxxxxxxxx"
                                pattern="05\d{9}"
                                required
                            />
                            <div className="form-text">
                                Please enter an 11-digit number starting with 05.
                            </div>
                            </div>

                            <button type="submit" className="btn btn-warning w-100 fw-bold">
                            Update
                            </button>
                        </form>
                    </div>

                    {/* Yan Panel */}
                    <div className="col-lg-4 col-12 ">
                        <div className="bg-white rounded shadow-lg p-4 h-100 d-flex flex-column justify-content-center">
                            <h4 className="text-center fw-bold mb-4">Others</h4>
                            <div className="d-grid gap-3">
                    {/* Change Password Button */}
                    <button 
                    className="btn btn-outline-primary fw-bold"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#changePasswordPanel"
                    onClick={clearInputs}
                    >
                        Change Password
                    </button>

                    {/* Offcanvas (Right Panel) */}
                    <div
                    className="offcanvas offcanvas-end"
                    tabIndex="-1"
                    id="changePasswordPanel"
                    aria-labelledby="changePasswordLabel"
                    >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="changePasswordLabel">Change Password</h5>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        {/* Şifre Değiştirme Formu */}
                        <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input
                            type="password"
                            className="form-control passChange-inputs passChange-inputs-1"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordInput}
                            required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                            type="password"
                            className="form-control passChange-inputs passChange-inputs-2"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordInput}
                            required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input
                            type="password"
                            className="form-control passChange-inputs passChange-inputs-3"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordInput}
                            required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 fw-bold">
                            Save
                        </button>
                        <p></p>
                        </form>
                    </div>
                    </div>
                                <button onClick={() => navigate("/MyAds")} className="btn btn-outline-secondary fw-bold">My Ads</button>
                                <button onClick={() => navigate("/Favourites")} className="btn btn-outline-success fw-bold">My Favourites</button>
                                <button onClick={() => navigate("/AddHome")} className="btn btn-outline-success fw-bold">New Ad</button>
                                <button onClick={() => navigate("/Conversation")} className="btn btn-outline-success fw-bold">Chat</button>
                                <button className="btn btn-outline-danger fw-bold">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 text-center rounded-top mt-5 bottom">
            <div className="container">
            <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
            </div>
        </footer>
    </div>
  );
}

export default Profile;
