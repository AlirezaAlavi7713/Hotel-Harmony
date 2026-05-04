import "../css/Footer.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer" aria-label="Site footer">
            <div className="footer__inner">
                {/* Top */}
                <div className="footer__top">
                    <div className="footer__brand">
                        <Link to="/"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            <img className="footer__logo" src={logo} alt="Hotel Harmony logo" />
                        </Link>
                        <p className="footer__tagline">
                            A place to slow down and feel at home.
                        </p>
                    </div>

                    <nav className="footer__nav" aria-label="Footer navigation">
                        <div className="footer__col">
                            <p className="footer__title">Hotel</p>
                            <Link className="footer__link" to="/rooms">Rooms</Link>
                            <Link className="footer__link" to="/contact">Contact</Link>
                            <Link className="footer__link" to="/auth">Login</Link>
                        </div>

                        <div className="footer__col">
                            <p className="footer__title">Reservations</p>
                            <Link className="footer__link" to="/rooms">Book</Link>
                            <Link className="footer__link" to="/auth">My account</Link>
                            <Link className="footer__link" to="/">Policy</Link>
                        </div>

                        <div className="footer__col">
                            <p className="footer__title">Contact</p>
                            <p className="footer__text">Front desk: +00 000 000 000</p>
                            <p className="footer__text">Email: contact@harmoni.com</p>
                            <div className="footer__social">
                                <Link className="footer__socialLink" to="/">Instagram</Link>
                                <Link className="footer__socialLink" to="/">Facebook</Link>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Bottom */}
                <div className="footer__bottom">
                    <p className="footer__copy">© {new Date().getFullYear()} Harmoni Hotel. All rights reserved.</p>
                    <div className="footer__legal">
                        <Link className="footer__legalLink" to="/">Privacy</Link>
                        <Link className="footer__legalLink" to="/">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
