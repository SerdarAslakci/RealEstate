import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";


function ExploreHomes() {
    const [homes, setHomes] = useState([]);
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [homeTypes, setHomeTypes] = useState([]);
    const [selectedFilterId,setSelectedFilterId] = useState(0);
    const [filtersPaging, setFiltersPaging] = useState({
      title: "",
      roomCount: "",
      bathroomCount: "",
      status: "",
      city: "",
      homeTypeName: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      pageNumber: 1,
      pageSize: 10,
      livingRoomCount: "",
      buildingAge: "",
      balconyCount: "",
      hasElevator: null,
      isFurnished: null,
    });
    const [favouriteFilters,setFavouriteFilters] = useState([]);
    const [filters, setFilters] = useState({
      title: "",
      roomCount: "",
      bathroomCount: "",
      status: "",
      city: "",
      homeTypeName: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      pageNumber: 1,
      pageSize: 10,
      livingRoomCount: "",
      buildingAge: "",
      balconyCount: "",
      hasElevator: null,
      isFurnished: null,
      sortBy: "",
      sortOrder: "",
    });
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const navigate = useNavigate();

    useEffect(() =>
    {
      fetchHomes();
    },[filtersPaging]);

    const cityList = [
      "Adana",
      "Adıyaman",
      "Afyonkarahisar",
      "Ağrı",
      "Aksaray",
      "Amasya",
      "Ankara",
      "Antalya",
      "Ardahan",
      "Artvin",
      "Aydın",
      "Balıkesir",
      "Bartın",
      "Batman",
      "Bayburt",
      "Bilecik",
      "Bingöl",
      "Bitlis",
      "Bolu",
      "Burdur",
      "Bursa",
      "Çanakkale",
      "Çankırı",
      "Çorum",
      "Denizli",
      "Diyarbakır",
      "Düzce",
      "Edirne",
      "Elazığ",
      "Erzincan",
      "Erzurum",
      "Eskişehir",
      "Gaziantep",
      "Giresun",
      "Gümüşhane",
      "Hakkâri",
      "Hatay",
      "Iğdır",
      "Isparta",
      "İstanbul",
      "İzmir",
      "Kahramanmaraş",
      "Karabük",
      "Karaman",
      "Kars",
      "Kastamonu",
      "Kayseri",
      "Kilis",
      "Kırıkkale",
      "Kırklareli",
      "Kırşehir",
      "Kocaeli",
      "Konya",
      "Kütahya",
      "Malatya",
      "Manisa",
      "Mardin",
      "Mersin",
      "Muğla",
      "Muş",
      "Nevşehir",
      "Niğde",
      "Ordu",
      "Osmaniye",
      "Rize",
      "Sakarya",
      "Samsun",
      "Şanlıurfa",
      "Siirt",
      "Sinop",
      "Sivas",
      "Şırnak",
      "Tekirdağ",
      "Tokat",
      "Trabzon",
      "Tunceli",
      "Uşak",
      "Van",
      "Yalova",
      "Yozgat",
      "Zonguldak"
    ];

    const handleFavouriteFilterChange = (event) => {
        const selectedId = event.target.value;
        setSelectedFilterId(selectedId);
        if (selectedId == 0) { 
            clearFilters();
            return;
        }
        const selectedFavFilter = favouriteFilters.find(
            (filter) => filter.id == selectedId
        );

        if (selectedFavFilter) {
            setFilters({
                title: selectedFavFilter.title || "",
                roomCount: selectedFavFilter.roomCount || "",
                bathroomCount: selectedFavFilter.bathroomCount || "",
                status: selectedFavFilter.status === null ? "" : selectedFavFilter.status.toString(), 
                city: selectedFavFilter.city || "",
                homeTypeName: selectedFavFilter.homeTypeName || "",
                minPrice: selectedFavFilter.minPrice || "",
                maxPrice: selectedFavFilter.maxPrice || "",
                minArea: selectedFavFilter.minArea || "",
                maxArea: selectedFavFilter.maxArea || "",
                pageNumber: 1,
                pageSize: filters.pageSize,
                livingRoomCount: selectedFavFilter.livingRoomCount || "",
                buildingAge: selectedFavFilter.buildingAge || "",
                balconyCount: selectedFavFilter.balconyCount || "",
                hasElevator: selectedFavFilter.hasElevator,
                isFurnished: selectedFavFilter.isFurnished,
                sortBy: selectedFavFilter.sortBy || "",
                sortOrder: selectedFavFilter.sortOrder || "",
            });
            setSortBy(selectedFavFilter.sortBy || "");
            setSortOrder(selectedFavFilter.sortOrder || "");
        }
    };

    const getProfile = () => 
    {
      const token = localStorage.getItem("token");

      axios.get("http://localhost:5250/api/Profile",
        {
          headers:
          {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => 
        {
          if(res.data != null)
          {
            setIsLoggedIn(true);
          }          
        })
        .catch((err) => 
        {
          if(err.response.status === 401)
          {
            setIsLoggedIn(false);
          }
        })
    }

    useEffect(() =>
    {
        getProfile();
    },[]);

    const fetchHomes = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5250/api/Home/Homes", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            title:  null,
            city: filters.city || null,
            homeTypeName: filters.homeTypeName || null,
            roomCount: filters.roomCount || null,
            bathroomCount: filters.bathroomCount || null,
            status: filters.status || null,
            minPrice: filters.minPrice || null,
            maxPrice: filters.maxPrice || null,
            minArea: filters.minArea || null,
            maxArea: filters.maxArea || null,
            pageNumber: filters.pageNumber,
            pageSize: filters.pageSize,
            livingRoomCount: filters.livingRoomCount || null,
            buildingAge: filters.buildingAge || null,
            balconyCount: filters.balconyCount || null,
            hasElevator: filters.hasElevator !== undefined ? filters.hasElevator : null,
            isFurnished: filters.isFurnished !== undefined ? filters.isFurnished : null,
            sortBy: filters.sortBy !== undefined ? filters.sortBy : null,
            sortOrder: filters.sortOrder !== undefined ? filters.sortOrder : null,
          }
        });
        setHomes(response.data);
      } catch (error) {
        console.error("Evleri çekerken hata oluştu:", error);
        if (error.response && error.response.status === 404) {
          setError("Uygun ev bulunamadı.");
          setHomes([]);
        } else {
          setError("Bir hata oluştu, lütfen tekrar deneyin.");
        }
      }
    };

    const getUserFavouriteFilters = async () => 
    {
      if(isLoggedIn)
      {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5250/api/Home/GetFavouriteFilters",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        .then((res) => {
          setFavouriteFilters(res.data);
          if (res.data.length > 0) {
            setSelectedFilterId(res.data[0].id);
          }
        })
        .catch((err) => console.error(err));
      }
      else{
      }
    }

    useEffect(() => {
      fetchHomes();
      fetchHomeTypes();      
    }, []);

    useEffect(() => {
      if (isLoggedIn) {
        getUserFavouriteFilters();
      }
    }, [isLoggedIn]);

    const handleLogout = () =>
    {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate
    };

    const fetchHomeTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5250/api/Home/GetHomeTypes");
        if (response.data) {
          setHomeTypes(response.data);
        }
      } catch (error) {
        console.error("Ev tiplerini çekerken hata oluştu", error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFilters({ ...filters, [name]: value });
    };

    const handleFilter = () => {
      fetchHomes();
    };

    const saveFilter = async () => 
    {
      try {
        const token = localStorage.getItem("token");
        const title = prompt("Add Title");
        if (!title) {
          alert("Başlık boş bırakılamaz.");
          return;
        }

        const response = await axios.post(
          "http://localhost:5250/api/Home/AddFavouriteFilter",
          {
            title: title,
            city: filters.city || null,
            homeTypeName: filters.homeTypeName || null,
            roomCount: filters.roomCount || null,
            bathroomCount: filters.bathroomCount || null,
            status: filters.status || null,
            minPrice: filters.minPrice || null,
            maxPrice: filters.maxPrice || null,
            minArea: filters.minArea || null,
            maxArea: filters.maxArea || null,
            pageNumber: filters.pageNumber,
            pageSize: filters.pageSize,
            livingRoomCount: filters.livingRoomCount || null,
            buildingAge: filters.buildingAge || null,
            balconyCount: filters.balconyCount || null,
            hasElevator: filters.hasElevator !== undefined ? filters.hasElevator : null,
            isFurnished: filters.isFurnished !== undefined ? filters.isFurnished : null,
            sortBy: filters.sortBy !== undefined ? filters.sortBy : null,
            sortOrder: filters.sortOrder !== undefined ? filters.sortOrder : null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    function formatDate(isoDateString) {
      if (!isoDateString) return ""; 
      const date = new Date(isoDateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('tr-TR', options);
    }

    const handleHomeClick = (id) => {
      navigate(`/Home/${id}`);
    };

    const formatRoomCount = (rooms, livingRoomCount) => {
      return `${rooms -livingRoomCount}+${livingRoomCount}`;
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
        else
        {
          axios.post(
            "http://localhost:5250/api/Home/Add_Favourites",
            JSON.stringify(home.id),
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              home.isFavourite = true;
              fetchHomes();
            }
          })
          .catch((err) => {
            if (err.response) {
              console.error("API Hatası:", err.response.data);
            } else if (err.request) {
              console.error("Sunucuya istek gönderilemedi:", err.request);
            } else {
              console.error("İstek yapılandırma hatası:", err.message);
            }
          });


        }
    }

    const sortedHomes = [...homes].sort((a, b) => {
      if (!sortBy || !sortOrder) return 0;

      const aVal = sortBy === "price" ? a.price : new Date(a.createdAt);
      const bVal = sortBy === "price" ? b.price : new Date(b.createdAt);

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const goToNextPage = () => {
        if(homes.length != 0)
        {
          setFilters(prev => ({
              ...prev,
              pageNumber: prev.pageNumber + 1
            }));
            setFiltersPaging(prev => ({
              ...prev,
              pageNumber: Math.max(prev.pageNumber - 1, 1)
            }));
        }
    };

    const goToPreviousPage = () => {
        setFilters(prev => ({
          ...prev,
          pageNumber: Math.max(prev.pageNumber - 1, 1)
        }));
        setFiltersPaging(prev => ({
          ...prev,
          pageNumber: Math.max(prev.pageNumber - 1, 1)
        }));
    };

    const clearFilters = () => 
    {
        setFilters({
          title: "",
          roomCount: "",
          bathroomCount: "",
          status: "",
          city: "",
          homeTypeName: "",
          minPrice: "",
          maxPrice: "",
          minArea: "",
          maxArea: "",
          pageNumber: 1,
          pageSize: 10,
          livingRoomCount: "",
          buildingAge: "",
          balconyCount: "",
          hasElevator: null,
          isFurnished: null,
          sortBy: "",
          sortOrder: ""
        });
        
        setSortBy(null);
        setSortOrder(null);
    }

  return (
    <div className="container-fluid w-90 px-3">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="row">
        {/* Sol Panel: Filtre Formu */}
        <div className="col-md-3 col-12">
          <div className="card p-3 shadow-sm " >
            <h5 className="mb-3">Filter</h5>
              <select className="mb-4" value={selectedFilterId} onChange={handleFavouriteFilterChange}>
                <option key={0} value={0}>
                    Select Filter
                </option>
                {favouriteFilters.map((filter) => (           
                  <option key={filter.id} value={filter.id}>
                    {filter.title}
                  </option>
                ))}
              </select>

            <button className="btn btn-dark py-1 mb-1" onClick={saveFilter}>Save Filter</button>         
            <button className="btn btn-dark py-1 mb-4" onClick={clearFilters}>Remove Filters</button>

            <label htmlFor="title" className="form-label">Title</label>
            <input name="title" value={filters.title} onChange={handleInputChange}  className="form-control mb-2" readonly="false" />

            <label htmlFor="city" className="form-label">City</label>
            <select name="city" value={filters.city} onChange={handleInputChange} className="form-select mb-2 text-black">
              <option value="" className="text-black">Select City</option>
              {cityList.map((city, index) => (
                <option key={index} value={city} className="text-black">{city}</option>
              ))}
            </select>

            <label htmlFor="roomCount" className="form-label">Room Count</label>
            <input type="number" name="roomCount" min={0} value={filters.roomCount} onChange={handleInputChange} className="form-control mb-2" placeholder="Example: 3" />

            <label htmlFor="bathroomCount" className="form-label">Bathroom Count</label>
            <input type="number" name="bathroomCount" min={0} value={filters.bathroomCount} onChange={handleInputChange} className="form-control mb-2" placeholder="Example: 2" />

            <label htmlFor="status" className="form-label">Durum</label>
            <select name="status" value={filters.status} onChange={handleInputChange} className="form-select mb-2">
              <option value="0">For Sale</option>
              <option value="1">For Rent</option>
            </select>

            <label htmlFor="homeTypeName" className="form-label">Home Type</label>
            <select name="homeTypeName" value={filters.homeTypeName} onChange={handleInputChange} className="form-select mb-2 text-black">
              <option value="" className="text-black">Select Home Type</option>
              {homeTypes.map((type) => (
                <option key={type.id} className="text-black" value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>

            <label htmlFor="minPrice" className="form-label">Min Price</label>
            <input type="number" name="minPrice" min={0} value={filters.minPrice} onChange={handleInputChange} className="form-control mb-2" placeholder="Min Price (₺)" />

            <label htmlFor="maxPrice" className="form-label">Max Price</label>
            <input type="number" name="maxPrice" min={0} value={filters.maxPrice} onChange={handleInputChange} className="form-control mb-2" placeholder="Max Price (₺)" />

            <label htmlFor="minArea" className="form-label">Min Area-m²</label>
            <input type="number" name="minArea" min={0} value={filters.minArea} onChange={handleInputChange} className="form-control mb-2" placeholder="Min m²" />

            <label htmlFor="maxArea" className="form-label">Max Area-m²"</label>
            <input type="number" name="maxArea" min={0} value={filters.maxArea} onChange={handleInputChange} className="form-control mb-2" placeholder="Max m²" />

            <label htmlFor="livingRoomCount" className="form-label">Living Room Count</label>
            <input
              type="number"
              name="livingRoomCount"
              value={filters.livingRoomCount}
              onChange={handleInputChange}
              className="form-control mb-2"
              placeholder="Example: 1"
              min={0}
            />

            <label htmlFor="buildingAge" className="form-label">Bulding Age</label>
            <input
              type="number"
              name="buildingAge"
              value={filters.buildingAge}
              onChange={handleInputChange}
              className="form-control mb-2"
              placeholder="Example: 5 (year)"
              min={0}
            />

            <label htmlFor="balconyCount" className="form-label">Balcony Count</label>
            <input
              type="number"
              name="balconyCount"
              value={filters.balconyCount}
              onChange={handleInputChange}
              className="form-control mb-2"
              placeholder="Example: 1"
              min={0}
            />

            <div className="form-check mb-2">
              <input
                type="checkbox"
                id="hasElevator"
                name="hasElevator"
                checked={filters.hasElevator === true} 
                onChange={(e) => setFilters({
                  ...filters,
                  [e.target.name]: e.target.checked ? true : null
                })}
                className="form-check-input"
              />
              <label htmlFor="hasElevator" className="form-check-label">
                Has an Elevator
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                type="checkbox"
                id="isFurnished"
                name="isFurnished"
                checked={filters.isFurnished === true}
                onChange={(e) => setFilters({
                  ...filters,
                  [e.target.name]: e.target.checked ? true : null
                })}
                className="form-check-input"
              />
              <label htmlFor="isFurnished" className="form-check-label">
                Furnished
              </label>
            </div>

            <button className="btn btn-primary w-100 mt-2" onClick={handleFilter}>
              Search
            </button>
          </div>

            <h6 className="mt-3">Order By</h6>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="sortOptions"
                id="noSort"
                checked={filters.sortBy === "" && filters.sortOrder === ""}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "",
                    sortOrder: "",
                    page: 1,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="noSort">
                No Ordered
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="sortOptions"
                id="sortPriceAsc"
                checked={filters.sortBy === "price" && filters.sortOrder === "asc"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "price",
                    sortOrder: "asc",
                    page: 1,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="sortPriceAsc">                
                Price Ascending
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="sortOptions"
                id="sortPriceDesc"
                checked={filters.sortBy === "price" && filters.sortOrder === "desc"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "price",
                    sortOrder: "desc",
                    page: 1,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="sortPriceDesc">
                Price Descending
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="sortOptions"
                id="sortDateAsc"
                checked={filters.sortBy === "createdAt" && filters.sortOrder === "asc"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "createdAt",
                    sortOrder: "asc",
                    page: 1,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="sortDateAsc">
                Ascending by Listing Date (Oldest)
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="sortOptions"
                id="sortDateDesc"
                checked={filters.sortBy === "createdAt" && filters.sortOrder === "desc"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                    page: 1,
                  }))
                }
              />
              <label className="form-check-label" htmlFor="sortDateDesc">
                Descending by Listing Date (Newest)
              </label>
            </div>

        </div>

        {/* Sağ Panel: Evler */}
        <div className="col-md-9 col-12">
          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : homes.length === 0 ? (
            <p className="text-center">Yükleniyor veya ev bulunamadı.</p>
          ) : (
            <div className="row">
              {sortedHomes.map((home) => (
                <div
                  className="col-md-12 mb-4"
                  key={home.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHomeClick(home.id)}
                >
                  <div className="card d-flex flex-column justify-content-center align-items-center flex-sm-row shadow-sm">
                    <img
                      src={home.homeImage?.[0]?.imageUrl ? "http://localhost:5250" + home.homeImage[0].imageUrl : "https://via.placeholder.com/300x200"}
                      className="img-fluid"
                      style={{ width: "300px",height :"100%", objectFit: "cover", borderTopLeftRadius: "0.375rem", borderBottomLeftRadius: "0.375rem" }}
                      alt={home.title}
                    />
                    <div className="card-body">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavourite(home,home.isFavourite);
                      }}
                      className="btn btn-light position-absolute top-0 end-0 m-2"
                      title="Favorilere Ekle"
                    >
                      <i className={`bi ${home.isFavourite ? "bi-star-fill text-warning" : "bi-star"}`}></i>
                    </button>



                      <h5 className="card-title">{home.title}</h5>
                      <p className="card-text">{home.description?.substring(0, 150)}...</p>

                      {/* Yeni eklenen detaylar */}
                      <p>
                        <strong>Square Meter:</strong> {home.area} m²
                      </p>
                      <p>
                        <strong>Room Count:</strong> {formatRoomCount(home.roomCount,home.livingRoomCount)}
                      </p>
                      <p>
                        <strong>Location:</strong> {home.address.city} / {home.address.district}
                      </p>
                      <p>
                        <strong>Ad Creation Date:</strong> {formatDate(home.createdAt)}
                      </p>

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


          <div className="d-flex space-between">
             <button onClick={goToPreviousPage} disabled={filters.pageNumber === 1}>
              ←
            </button>
            <button onClick={goToNextPage}>
              →
            </button>
          </div>
        </div>
       

      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center rounded-top mt-5">
        <div className="container">
          <small>&copy; 2025 RealEstateSite. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default ExploreHomes;
