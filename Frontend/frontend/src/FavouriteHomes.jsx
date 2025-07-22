import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function FavouriteHomes() {
  const [homes, setHomes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    }

    fetchHomes();

  }, [token, navigate]);


  const fetchHomes = () => 
  {
    axios
      .get("http://localhost:5250/api/Home/Homes/Favourites", 
      {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHomes(res.data))
      .catch((err) => {
        console.error(err);
        setError("Favori ilanlar yüklenemedi.");
      });
  }
  const handleLogout = () => 
  {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  }

  const handleHomeClick = (id) => {
    navigate(`/Home/${id}`);
  };

  const handleFavourite = (home,isFavourite) => 
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
              fetchHomes();
            }
        })
        .catch((err) => {
            if (err.response.status === 401) {
              setIsLoggedIn(false);
              navigate("/Login");
            }
        });

      if(isFavourite)
      {    
          axios.delete("http://localhost:5250/api/Home/Remove_Favourite", {
            data: JSON.stringify(home.id),
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 200) {
              home.isFavourite = false;
            }
          })
          .catch((err) => {
            console.error("Favori kaldırma hatası:", err);
          });
      }
  }
  
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("tr-TR");
  const formatRoomCount = (oda, salon) => `${oda}+${salon}`;

  return (
    <div className="container-fluid w-90 px-3">
      {/* Navbar */}
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
                <Link onClick={handleLogout} className="nav-link text-white" to="/">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="row justify-content-center">
        <div className="col-md-9 col-12">
          <h2 className="mb-4 fw-bold">Favorite Ads</h2>

          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : homes.length === 0 ? (
            <p className="text-center">You don't have any favorite ads yet.</p>
          ) : (
            <div className="row">
              {homes.map((home) => (
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavourite(home, home.isFavourite);
                        }}
                        className="btn btn-light position-absolute top-0 end-0 m-2"
                        title="Favoriden Çıkar"
                      >
                        <i className="bi bi-star-fill text-warning"></i>
                      </button>

                      <h5 className="card-title">{home.title}</h5>
                      <p className="card-text">{home.description?.substring(0, 150)}...</p>
                      <p><strong>Metrekare:</strong> {home.area} m²</p>
                      <p><strong>Oda:</strong> {formatRoomCount(home.roomCount, home.livingRoomCount)}</p>
                      <p><strong>Konum:</strong> {home.address.city} / {home.address.district}</p>
                      <p><strong>İlan Tarihi:</strong> {formatDate(home.createdAt)}</p>
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

export default FavouriteHomes;
