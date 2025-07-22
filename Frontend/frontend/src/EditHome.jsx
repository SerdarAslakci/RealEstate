import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function EditHome() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
    price: 0,
    roomCount: 0,
    livingRoomCount: 0,
    bathroomCount: 0,
    floor: 0,
    area: 0,
    buildingAge: 0,
    balconyCount: 0,
    hasElevator: false,
    isFurnished: false,
    addressDto: {
      city: "",
      district: "",
      neighborhood: "",
      fullAddress: "",
    },
    homeTypes: [],
  });

  const [availableHomeTypes, setAvailableHomeTypes] = useState([]);
  const [selectedHomeTypes, setSelectedHomeTypes] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cityList = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
    "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
    "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Iğdır", "Isparta", "İstanbul",
    "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale", "Kırklareli",
    "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop",
    "Sivas", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
  ];

  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    } else {
      setIsLoggedIn(true);
    }

    fetchHomeTypes();

    if (id) {
      fetchHomeDetails(id);
    }
  }, [token, id, navigate]);

  const fetchHomeTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5250/api/Home/GetHomeTypes");
      if (response.data) {
        setAvailableHomeTypes(response.data);
      }
    } catch (err) {
      console.error("Error fetching home types:", err);
      setError("Failed to load home types.");
    }
  };

  const fetchHomeDetails = async (homeId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5250/api/Home/Homes/${homeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;

      // Populate form data
      setFormData({
        id: data.id,
        title: data.title,
        description: data.description || "",
        status: data.status,
        price: data.price,
        roomCount: data.roomCount,
        livingRoomCount: data.livingRoomCount,
        bathroomCount: data.bathroomCount,
        floor: data.floor,
        area: data.area,
        buildingAge: data.buildingAge,
        balconyCount: data.balconyCount,
        hasElevator: data.hasElevator,
        isFurnished: data.isFurnished,
        addressDto: {
          city: data.address?.city || "",
          district: data.address?.district || "",
          neighborhood: data.address?.neighborhood || "",
          fullAddress: data.address?.fullAddress || "",
        },
        homeTypes: data.homeTypeDto ? data.homeTypeDto.map(type => type.name) : [],
      });

      // Populate selected home types (for checkboxes)
      setSelectedHomeTypes(data.homeTypeDto ? data.homeTypeDto.map(type => type.name) : []);

      // Populate existing images
      setExistingImages(data.homeImage || []);

    } catch (err) {
      console.error("Error fetching ad details:", err);
      if (err.response && err.response.status === 404) {
        setError("Ad not found.");
      } else if (err.response && err.response.status === 401) {
        navigate("/Login");
      } else {
        setError("An error occurred while loading ad details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("addressDto.")) {
      const addressFieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        addressDto: {
          ...prev.addressDto,
          [addressFieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleHomeTypeChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedHomeTypes((prev) => [...prev, value]);
      setFormData((prev) => ({
        ...prev,
        homeTypes: [...prev.homeTypes, value],
      }));
    } else {
      setSelectedHomeTypes((prev) => prev.filter((type) => type !== value));
      setFormData((prev) => ({
        ...prev,
        homeTypes: prev.homeTypes.filter((type) => type !== value),
      }));
    }
  };

  const handleUploadNewImages = async () => {
    if (newImages.length === 0) return;

    const formData = new FormData();
    newImages.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`http://localhost:5250/api/Home/Add_Home_Photos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setNewImages([]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleNewImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const handleRemoveExistingImage = async (imageId, homeId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    setLoading(true);

    try {
      await axios.delete(`http://localhost:5250/api/Home/Delete_Home_Photo/${homeId}/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setExistingImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );

      setSuccessMessage("Image deleted successfully.");
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("An error occurred while deleting the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      let response;

      if (id) {
        response = await axios.put(
          `http://localhost:5250/api/Home/UpdateHome/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Ad updated successfully!");
        handleUploadNewImages();
      } else {
        response = await axios.post(
          "http://localhost:5250/api/Home/AddHome",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Ad created successfully!");
        setFormData({
          title: "",
          description: "",
          status: 0,
          price: 0,
          roomCount: 0,
          livingRoomCount: 0,
          bathroomCount: 0,
          floor: 0,
          area: 0,
          buildingAge: 0,
          balconyCount: 0,
          hasElevator: false,
          isFurnished: false,
          addressDto: {
            city: "",
            district: "",
            neighborhood: "",
            fullAddress: "",
          },
          homeTypeIds: [],
        });
      }

      navigate("/MyAds");
    } catch (err) {
      console.error("Error during operation:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "An error occurred, please try again.");
      if (err.response && err.response.status === 401) {
        navigate("/Login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <div className="container-fluid w-90 px-3 flex-grow-1">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-5 mt-0 shadow-sm rounded-bottom">
        <div className="container-fluid px-5">
          <Link className="navbar-brand text-white fw-bold fs-2" to="/">🏠︎</Link>
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
                <Link className="nav-link text-white" to="/ExploreHomes">Homes</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white btn btn-link d-flex align-items-center gap-2"
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-10 col-12">
          <div className="card p-4 shadow-lg mb-5 rounded">
            <h2 className="mb-4 fw-bold text-center">{id ? "Edit Ad" : "Create New Ad"}</h2>

            {loading && <div className="alert alert-info text-center">Loading...</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
              {/* General Information */}
              <h5 className="mt-4 mb-3">General Information</h5>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleInputChange} required maxLength="150" />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select className="form-select" id="status" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="0">For Sale</option>
                    <option value="1">For Rent</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="price" className="form-label">Price (₺)</label>
                  <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="roomCount" className="form-label">Room Count</label>
                  <input type="number" className="form-control" id="roomCount" name="roomCount" value={formData.roomCount} onChange={handleInputChange} min="0" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="livingRoomCount" className="form-label">Living Room Count</label>
                  <input type="number" className="form-control" id="livingRoomCount" name="livingRoomCount" value={formData.livingRoomCount} onChange={handleInputChange} min="0" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="bathroomCount" className="form-label">Bathroom Count</label>
                  <input type="number" className="form-control" id="bathroomCount" name="bathroomCount" value={formData.bathroomCount} onChange={handleInputChange} min="0" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="floor" className="form-label">Floor</label>
                  <input type="number" className="form-control" id="floor" name="floor" value={formData.floor} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label htmlFor="area" className="form-label">Area (m²)</label>
                  <input type="number" className="form-control" id="area" name="area" value={formData.area} onChange={handleInputChange} required min="0" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="buildingAge" className="form-label">Building Age</label>
                  <input type="number" className="form-control" id="buildingAge" name="buildingAge" value={formData.buildingAge} onChange={handleInputChange} min="0" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="balconyCount" className="form-label">Balcony Count</label>
                  <input type="number" className="form-control" id="balconyCount" name="balconyCount" value={formData.balconyCount} onChange={handleInputChange} min="0" />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="hasElevator" name="hasElevator" checked={formData.hasElevator} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="hasElevator">Has Elevator</label>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="isFurnished" name="isFurnished" checked={formData.isFurnished} onChange={handleInputChange} />
                    <label className="form-check-label" htmlFor="isFurnished">Is Furnished</label>
                  </div>
                </div>
              </div>

              {/* Home Types (Checkbox Group) */}
              <div className="mb-3">
                <label className="form-label">Home Types</label>
                <div className="d-flex flex-wrap gap-3">
                  {availableHomeTypes.map((type) => (
                    <div className="form-check" key={type.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`homeType-${type.id}`}
                        value={type.name}
                        checked={selectedHomeTypes.includes(type.name)}
                        onChange={handleHomeTypeChange}
                      />
                      <label className="form-check-label" htmlFor={`homeType-${type.id}`}>
                        {type.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Information */}
              <h5 className="mt-4 mb-3">Address Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">City</label>
                  <select className="form-select" id="city" name="addressDto.city" value={formData.addressDto.city} onChange={handleInputChange}>
                    <option value="">Select City</option>
                    {cityList.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="district" className="form-label">District</label>
                  <input type="text" className="form-control" id="district" name="addressDto.district" value={formData.addressDto.district} onChange={handleInputChange} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="neighborhood" className="form-label">Neighborhood</label>
                  <input type="text" className="form-control" id="neighborhood" name="addressDto.neighborhood" value={formData.addressDto.neighborhood} onChange={handleInputChange} />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="fullAddress" className="form-label">Full Address</label>
                <textarea className="form-control" id="fullAddress" name="addressDto.fullAddress" value={formData.addressDto.fullAddress} onChange={handleInputChange} rows="2"></textarea>
              </div>

              {/* Image Upload and Display */}
              <h5 className="mt-4 mb-3">Photos</h5>
              {id && existingImages.length > 0 && (
                <div className="mb-3">
                  <h6>Existing Photos:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {existingImages.map((image) => (
                      <div key={image.id} className="position-relative" style={{ width: "100px", height: "100px" }}>
                        <img
                          src={`http://localhost:5250${image.imageUrl}`}
                          alt="Existing Home Image"
                          className="img-thumbnail"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle"
                          onClick={() => handleRemoveExistingImage(image.id, id)}
                          title="Delete Image"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="imageUpload" className="form-label">Upload New Photos</label>
                <input type="file" className="form-control" id="imageUpload" multiple onChange={handleNewImageSelect} accept="image/*" />
                {newImages.length > 0 && (
                  <div className="mt-2">
                    <h6>New Images to Upload:</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      {newImages.map((file, index) => (
                        <div key={index}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                          <div style={{ fontSize: "12px", textAlign: "center" }}>{file.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100 mt-4" disabled={loading}>
                {loading ? "Saving..." : (id ? "Update Ad" : "Create Ad")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center rounded-top mt-auto">
        <div className="container">
          <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default EditHome;