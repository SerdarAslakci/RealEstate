import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";

function HomeDetails() {
    const { id } = useParams();
    const [home, setHome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments,setComments] = useState([]);
    const [loggedUserId,setLoggedUserId] = useState("");
    const [commentText,setCommentText] = useState("");
    const [point,setPoint] = useState(-1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [ownerInfo, setOwnerInfo] = useState(null);
    const [ownerLoading, setOwnerLoading] = useState(false);
    const [ownerError, setOwnerError] = useState(null);
    const [alreadyHasCommentError,setAlreadyHasCommentError] = useState("");

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
                setLoggedUserId(res.data.id);
                setOwnerInfo(res.data);
            }
        })
        .catch((err) => {
            if (err.response.status === 401) {
                setIsLoggedIn(false);
            }
        });
    },[]);
    
    useEffect(() => {
        async function fetchHome() {
        try {
            const response = await axios.get(`http://localhost:5250/api/Home/Homes/${id}`);
            if(response.data) {
                setHome(response.data);
            }
        } catch (error) {
            console.error("Ev bulunamadı veya hata oluştu", error);
            setHome(null); 
        } finally {
            setLoading(false);
        }
        }
        fetchHome();
        fetchHomeComments();
    }, [id, navigate]);

    useEffect(() => {
        if (home && home.userId) {
        setOwnerLoading(true);
        setOwnerError(null);

        async function fetchOwnerInfo() {
            try {
            const response = await axios.get(`http://localhost:5250/api/Profile/${home.userId}`);
            setOwnerInfo(response.data); 
            } catch (error) {
            console.error("İlan sahibi bilgileri çekilirken hata oluştu:", error);
            if (error.response && error.response.status === 404) {
                setOwnerError("İlan sahibi bilgileri bulunamadı.");
            } else {
                setOwnerError("İlan sahibi bilgileri yüklenirken bir sorun oluştu.");
            }
            } finally {
                setOwnerLoading(false);
            }
        }
        fetchOwnerInfo();
        } else if (home && !home.userId) {
            setOwnerInfo(null);
            setOwnerError("İlan sahibine ait bir kullanıcı ID'si bulunamadı.");
            setOwnerLoading(false);
        } else {
            setOwnerInfo(null);
            setOwnerError(null);
            setOwnerLoading(false);
        }
    }, [home]);

    const fetchHomeComments = async () => 
    {
        const token = localStorage.getItem("token");

        await axios
            .get(`http://localhost:5250/api/Comment/${id}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => 
            {
                if(response.data != null)
                {
                    setComments(response.data);
                }
            })
    }
    function formatDate(isoDate) {
        const date = new Date(isoDate);

        const day = date.getDate();
        const monthIndex = date.getMonth(); // 0-11
        const year = date.getFullYear();

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthName = months[monthIndex];

        return `${day} ${monthName} ${year}`;
    }
    const handleDeleteComment = async (commentId) => 
    {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if(!confirmDelete) return;

        const token = localStorage.getItem("token");
        try {
            const res = await axios.delete(`http://localhost:5250/api/Comment/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(res.data != null) {
                setComments(prev => prev.filter(comment => comment.id !== commentId));
            }
            setAlreadyHasCommentError("");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate("/Login");
            }
            else
            {
                console.log(err.response.message);
            }
        }
    }
    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoggedUserId("");
        localStorage.removeItem("token");
        navigate("/");
    };
    const handleAddComment = async (e)  => 
    {
        e.preventDefault();
        const token = localStorage.getItem("token");
        await axios
            .post(`http://localhost:5250/api/Comment`,
                {
                    homeId : home.id,
                    commentText: commentText,
                    point :point
                },
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            ).then((res) => 
            {
                if(res.data)
                {
                    const data = res.data;
                    setComments(prev => [data,...prev]);
                    setPoint("");
                    setCommentText("");
                }
            })
            .catch((err)=> 
            {
                if(err.response && err.response.status == 401)
                {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    navigate("/Login");
                }
                else if(err.response && err.response.status == 400)
                {
                    setAlreadyHasCommentError(err.response.data + "If you want to add new comment delete your current comment");
                }
                else
                {
                    console.log(err.response);
                }
            })

    }

  return (
    <div className="container-fluid w-90 px-3">
        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />  

        <section className="py-4 py-md-5 bg-light">
            <div className="container">
                {loading ? (
                <div className="text-center py-5">
                    <h2>Loading...</h2>
                </div>
                ) : home ? (
                <div className="card shadow-sm rounded-lg">
                    <div className="card-body p-md-5">
                    <div className="row mb-4 align-items-center">
                        <div className="col-12 col-md-8 text-md-start">
                        <h1 className="h3 mb-1 text-dark">{home.title}</h1>
                        <p className="text-muted mb-0">
                            {home.address?.city} / {home.address?.district} / {home.address?.neighborhood}
                        </p>
                        </div>
                        <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                        <h2 className="text-primary fw-bold mb-0">{home.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</h2>
                        <p className="text-muted small">Credit Offers</p>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row">
                        <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                        {/* Image Carousel */}
                        {home.homeImage && home.homeImage.length > 0 ? (
                            <>
                            <div id="homeImageCarousel" className="carousel slide carousel-fade mb-3 " data-bs-ride="carousel">
                                <div className="carousel-inner rounded">
                                {home.homeImage.map((image, index) => (
                                    <div key={image.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div
                                        style={{
                                        height: "550px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#fff", 
                                        borderRadius: "0.375rem" 
                                        }}
                                    >
                                        <img
                                        src={image.imageUrl.startsWith('/uploads') ? `http://localhost:5250${image.imageUrl}` : image.imageUrl}
                                        className="d-block img-fluid" 
                                        alt={`Home Image ${index + 1}`}
                                        style={{
                                            maxWidth: "100%", 
                                            maxHeight: "100%", 
                                            objectFit: "contain",
                                        }}
                                        />
                                    </div>
                                    </div>
                                ))}
                                </div>
                                {home.homeImage.length > 1 && (
                                <>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#homeImageCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#homeImageCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                    </button>
                                </>
                                )}
                            </div>

                            {/* Small image previews (similar to the bottom row in the example image) */}
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {home.homeImage.map((image, index) => (
                                    <button
                                        key={`thumb-${image.id}`}
                                        type="button"
                                        data-bs-target="#homeImageCarousel"
                                        data-bs-slide-to={index}
                                        className={`btn p-0 border ${index === 0 ? 'border-primary border-2' : ''}`}
                                        aria-current={index === 0 ? 'true' : 'false'}
                                        aria-label={`Go to slide ${index + 1}`}
                                        style={{ width: '100px', height: '70px', overflow: 'hidden' }}
                                    >
                                        <img
                                            src={image.imageUrl.startsWith('/uploads') ? `http://localhost:5250${image.imageUrl}` : image.imageUrl}
                                            className="img-fluid w-100 h-100 object-fit-cover rounded"
                                            alt={`Thumbnail ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            </>
                        ) : (
                            <div className="text-center p-5 border rounded">
                            <p className="text-muted">Bu ilan için görsel bulunmamaktadır.</p>
                            </div>
                        )}

                        <h4 className="mt-5 mb-3 text-dark">Description</h4>
                        <p className="text-dark">{home.description}</p>
                        </div>

                        <div className="col-12 col-lg-4">
                        <div className="card border-0 bg-light-subtle">
                            <div className="card-header bg-primary text-white py-3 rounded-top">
                            <h5 className="mb-0">Advert Details</h5>
                            </div>
                            <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Advert No: <span className="fw-semibold text-dark">{home.id}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Advert Date: <span className="fw-semibold text-dark">{new Date(home.createdAt).toLocaleDateString('tr-TR')}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Property Type: <span className="fw-semibold text-dark">{home.homeTypeDto && home.homeTypeDto.length > 0 ? home.homeTypeDto[0].name : 'Belirtilmemiş'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Status: <span className="fw-semibold text-dark">{home.statusText}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                m² (Gross): <span className="fw-semibold text-dark">{home.area}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                m² (Net): <span className="fw-semibold text-dark">{(home.area * 0.9).toFixed(0)}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Room Count: <span className="fw-semibold text-dark">{home.roomCount}+{home.livingRoomCount}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Building Age: <span className="fw-semibold text-dark">{home.buildingAge}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Floor: <span className="fw-semibold text-dark">{home.floor === 0 ? 'Zemin Kat' : home.floor}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Floor Count: <span className="fw-semibold text-dark">Belirtilmemiş</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Bathroom Count: <span className="fw-semibold text-dark">{home.bathroomCount}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Balcony: <span className="fw-semibold text-dark">{home.balconyCount > 0 ? 'Var' : 'Yok'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Elevator: <span className="fw-semibold text-dark">{home.hasElevator ? 'Var' : 'Yok'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Furnished: <span className="fw-semibold text-dark">{home.isFurnished ? 'Evet' : 'Hayır'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Dues (₺): <span className="fw-semibold text-dark">Belirtilmemiş</span>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ) : (
                <div className="text-center py-5">
                    <h2>Ev bulunamadı</h2>
                </div>
                )}

                {/* İlanı Veren Kişi Bilgileri - Dinamik Yükleniyor */}
                  <div className="card shadow-sm rounded-lg mt-4">
                    <div className="card-header bg-success text-white py-3 rounded-top">
                      <h5 className="mb-0">Advertiser Information</h5>
                    </div>
                    {ownerLoading ? ( 
                      <div className="card-body text-center py-4">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-2 mb-0">Loading contact information...</p>
                      </div>
                    ) : ownerError ? (
                      <div className="card-body text-center py-4 text-danger">
                        <p>{ownerError}</p>
                      </div>
                    ) : ownerInfo ? (
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Name & LastName: <span className="fw-semibold text-dark">{ownerInfo.firstName} {ownerInfo.lastName}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Phone:
                            <a href={`tel:${ownerInfo.phoneNumber}`} className="fw-semibold text-primary text-decoration-none">
                              {ownerInfo.phoneNumber}
                            </a>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            E-mail:
                            <a href={`mailto:${ownerInfo.email}`} className="fw-semibold text-primary text-decoration-none">
                              {ownerInfo.email}
                            </a>
                          </li>
                          <li className="list-group-item text-center">
                            <a
                              href={`https://wa.me/${ownerInfo.phoneNumber.replace(/\s/g, '').replace(/^\+/, '')}?text=Merhaba,%20ilanınızla%20ilgili%20bilgi%20almak%20istiyorum.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-success w-100 mt-2"
                            >
                              <i className="bi bi-whatsapp me-2"></i> Contact on WhatsApp
                            </a>
                          </li>
                        {
                            loggedUserId && ownerInfo && loggedUserId != ownerInfo.id &&
                            (
                                <li className="list-group-item text-center">
                                    <Link
                                        to={`/Conversation`}
                                        state={{from: loggedUserId ,to: ownerInfo.id}}
                                        className="btn btn-primary w-100 mt-2"
                                    >
                                        <i className="bi bi-chat-dots me-2"></i> Contact on website
                                    </Link>
                                </li>
                            )
                        }
                        </ul>
                      </div>
                    ) : ( 
                      <div className="card-body text-center py-4 text-muted">
                        <p>Advertiser information not found.</p>
                      </div>
                    )}
                  </div>

                    <div className="card shadow-sm rounded-lg mt-4 p-2">
                    {
                        loggedUserId && ownerInfo && loggedUserId !== ownerInfo.id && (
                        alreadyHasCommentError ? (
                            <div className="alert alert-danger mb-3">{alreadyHasCommentError}</div>
                        ) : (
                            <form onSubmit={handleAddComment} className="p-3 border border-2 rounded bg-light mb-5">
                            <input type="hidden" name="homeId" value={id} />

                            <div className="mb-3">
                                <label htmlFor="commentText" className="form-label">Your Comment</label>
                                <textarea onChange={(e) => setCommentText(e.target.value)} className="form-control" id="commentText" name="commentText" rows="3" value={commentText} required></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="point" className="form-label">Rating</label>
                                <select onChange={(e) => setPoint(e.target.value)} value={point} className="form-select" id="point" name="point" required>
                                <option value="" disabled selected>Select rating</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary">Submit Comment</button>
                            </form>
                        )
                        )
                    }
                    {
                        comments.length > 0 ?
                        (
                        comments.map((comment) => (
                            // Key should be on the outermost element being mapped
                            <div className="p-3 border border-3 mb-2" key={comment.id}>
                            {loggedUserId === comment.userId &&
                                (
                                <div className="d-flex justify-content-end align-items-top">
                                    <button onClick={() => handleDeleteComment(comment.id)} type="button" className="btn btn-danger btn-sm rounded">
                                    &times;
                                    </button>
                                </div>
                                )
                            }
                            <div className="d-flex justify-content-between align-items-center mb-4"> {/* Removed key from here */}
                                <div className="d-flex gap-3 align-items-center" >
                                <h5>{comment.name[0]+"*******"} {comment.lastName[0]+"*******"}</h5>
                                <h6 className="fw-light">{formatDate(comment.createdAt)}</h6>
                                </div>
                                <div>
                                <i className={`bi ${comment.point >= 1 ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                                <i className={`bi ${comment.point >= 2 ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                                <i className={`bi ${comment.point >= 3 ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                                <i className={`bi ${comment.point >= 4 ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                                <i className={`bi ${comment.point >= 5 ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                                </div>
                            </div>

                            <div className="p-2 rounded" style={{backgroundColor: "lightGray"}}>
                                {comment.commentText}
                            </div>
                            </div>
                        ))
                        )
                        :
                        (
                        <h1>Comments are not found</h1>
                        )
                    }
                    </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 text-center rounded-top mt-5">
            <div className="container">
            <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
            </div>
        </footer>

    </div>
  );
}

export default HomeDetails;
