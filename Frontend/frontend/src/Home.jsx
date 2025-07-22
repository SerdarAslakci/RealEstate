import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";

function Home() {
  
  const[isLoggedIn,setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() =>
  {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5250/api/Profile",{
        headers :
        {
            Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => {
        if(res.data != null)
        {
          setIsLoggedIn(true);
        }
      })
      .catch((err) => {
        if (err.response &&  err.response.status === 401) 
        {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
        else if(err.response && err.response.status == 404)
        {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
      });
  },[]);

  const handleLogout = () => 
  {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="container-fluid w-90 px-3" >
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {/* Hero Section */}
      <section
        className="d-flex vh-100 align-items-center justify-content-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          borderRadius: "6px"
        }}
      >
        {/* Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark rounded" style={{opacity: 0.75}}></div>

        <div className="position-relative px-3">
          <h1 className="display-3 fw-bold">Find Your Dream Home</h1>
          <p className="lead mb-4">
            The largest real estate platform in Turkey, offering a safe and fast home search experience.
          </p>
          <Link to="/ExploreHomes" className="btn btn-warning btn-lg px-5 fw-bold shadow">
            Explore Homes
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 ">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <i className="bi bi-house-door-fill display-4 text-warning mb-3"></i>
                <h4>Thousands of Listings</h4>
                <p>Wide range of listings to fit every budget, with up-to-date and detailed information.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <i className="bi bi-shield-check display-4 text-warning mb-3"></i>
                <h4>Secure Transactions</h4>
                <p>Verified sellers and secure payment options for your peace of mind.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <i className="bi bi-phone-fill display-4 text-warning mb-3"></i>
                <h4>24/7 Support</h4>
                <p>Professional support team ready to assist you anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center rounded-top">
        <div className="container">
          <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default Home;
