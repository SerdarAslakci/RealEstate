import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-3 mt-0 shadow-sm rounded-bottom">
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
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/ExploreHomes">
                                        Homes
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/Profile">
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* onLogout fonksiyonunu props olarak alıp çağırıyoruz */}
                                    <button
                                        className="nav-link text-white btn btn-link d-flex align-items-center gap-2"
                                        onClick={onLogout}
                                        style={{ textDecoration: "none" }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;