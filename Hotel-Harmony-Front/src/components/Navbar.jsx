import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/Navbar.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role"); // "client" | "employe" | "admin" | null
    const isLogged = !!token;

    function closeMenu() {
        setOpen(false);
    }

    function handleLogout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("clientId");
        sessionStorage.removeItem("staffId");
        closeMenu();
        navigate("/auth");
    }

    // lien dashboard selon rôle
    const dashboardPath =
        role === "admin" || role === "employe" ? "/staff" : "/dashboard";

    return (
        <header className="nav">
            <div className="nav__inner">
                <Link to="/" className="nav__brand"
                    onClick={() => {
                        closeMenu();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <img className="nav__logo" src={logo} alt="Hotel Harmoni" />
                </Link>

                <button
                    className="nav__burger"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Ouvrir le menu"
                    aria-expanded={open}
                >
                    ☰
                </button>

                <nav className={`nav__links ${open ? "is-open" : ""}`}>
                    <Link to="/" onClick={closeMenu}>Home</Link>

                    <Link to="/contact" onClick={closeMenu}>Contact</Link>

                    {/* Le dashboard dépend du rôle connecté, donc on le garde accessible depuis tout le site. */}
                    {isLogged ? (
                        <>
                            <Link to={dashboardPath} onClick={closeMenu}>Dashboard</Link>
                            <button
                                type="button"
                                className="nav__logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" onClick={closeMenu}>Login</Link>
                    )}

                    <Link to="/rooms" onClick={closeMenu} className="nav__cta">
                        Book now
                    </Link>
                </nav>
            </div>
        </header>
    );
}
