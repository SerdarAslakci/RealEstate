import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";

function MyAds() {
  const [myHomes, setMyHomes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  
  const handleLogout = () => 
  {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  }
  const fetchMyHomes = async () => {
    if (!token) {
      navigate("/Login");
      return;
    }
    try {
      const res = await axios.get("http://localhost:5250/api/Home/GetUserHomeAds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyHomes(res.data);
    } catch (err) {
      console.error("İlanlarım yüklenirken hata oluştu:", err);
      if (err.response && err.response.status === 401) {
        navigate("/Login");
      }
      setError("İlanlarınız yüklenemedi.");
    }
  };
  useEffect(() => {
    fetchMyHomes();
  }, [token, navigate]);

  const handleHomeClick = (id) => {
    navigate(`/Home/${id}`); 
  };

  const handleEditAd = (id) => {
    navigate(`/EditHome/${id}`); 
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5250/api/Home/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyHomes((prevHomes) => prevHomes.filter((home) => home.id !== id));
      } catch (err) {
        console.error("İlan silinirken hata oluştu:", err);
        if (err.response && err.response.status === 401) {
          navigate("/Login");
        }
        setError("İlan silinirken bir hata oluştu.");
      }
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("tr-TR");
  const formatRoomCount = (oda, salon) => `${oda}+${salon}`;

  return (
    <div className="container-fluid w-90 px-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-5 mt-0 shadow-sm rounded-bottom">
        <div className="container-fluid px-5">
          <Link className="navbar-brand text-white fw-bold fs-2" to="/">🏠︎</Link>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/ExploreHomes">Homes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to={"/"} onClick={handleLogout}>
                    Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="row justify-content-center">
        <div className="col-md-9 col-12">
          <h2 className="mb-4 fw-bold">My Ads</h2>

          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : myHomes.length === 0 ? (
            <p className="text-center">Henüz verdiğiniz ilan bulunmamaktadır.</p>
          ) : (
            <div className="row">
              {myHomes.map((home) => (
                <div
                  className="col-md-12 mb-4"
                  key={home.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHomeClick(home.id)}
                >
                  <div className="card d-flex flex-column justify-content-center align-items-center flex-sm-row shadow-sm">
                    <img
                      src={
                        home.homeImage?.[0]?.imageUrl
                          ? "http://localhost:5250" + home.homeImage[0].imageUrl
                          : "https://via.placeholder.com/300x200"
                      }
                      className="img-fluid"
                      style={{
                        width: "300px",
                        height: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.375rem",
                        borderBottomLeftRadius: "0.375rem",
                      }}
                      alt={home.title}
                    />
                    <div className="card-body position-relative">
                      <div className="position-absolute top-0 end-0 m-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleEditAd(home.id);
                          }}
                          className="btn btn-primary btn-sm me-2"
                          title="İlanı Düzenle"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleDeleteAd(home.id);
                          }}
                          className="btn btn-danger btn-sm"
                          title="İlanı Sil"
                        >
                          <i className="bi bi-trash-fill"></i> 
                        </button>
                      </div>

                      <h5 className="card-title" onClick={() => handleHomeClick(home.id)} style={{cursor:"pointer"}}>{home.title}</h5>
                      <p className="card-text">{home.description?.substring(0, 150)}...</p>
                      <p><strong>Square Meters:</strong> {home.area} m²</p>
                      <p><strong>Room Count:</strong> {formatRoomCount(home.roomCount, home.livingRoomCount)}</p>
                      <p><strong>Location:</strong> {home.address.city} / {home.address.district}</p>
                      <p><strong>Ad Creation Date:</strong> {formatDate(home.createdAt)}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">{home.city}</small>
                        <span className="fw-bold text-success">{home.price.toLocaleString("tr-TR")} ₺</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAds;