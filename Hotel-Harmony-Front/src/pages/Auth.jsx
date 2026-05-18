import { useState } from "react";
import "../css/Auth.css";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import ClientService from "../services/ClientService";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const navigate = useNavigate();

    const [mode, setMode] = useState("login"); // "login" | "register"
    const isLogin = mode === "login";
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formElement = e.currentTarget;
        const form = new FormData(formElement);

        try {
            if (isLogin) {
                const payload = {
                    email: form.get("email"),
                    mot_de_passe: form.get("password"),
                };

                const res = await AuthService.login(payload);

                // token obligatoire
                if (!res?.token) {
                    throw new Error("No token received from server");
                }

                // stocker token
                sessionStorage.setItem("token", res.token);

                // Redirection selon le type
                if (res.type === "staff") {
                    // role = "admin" ou "employe"
                    sessionStorage.setItem("role", res.role);
                    sessionStorage.setItem("staffId", String(res.id_employe));
                    navigate("/staff");
                } else {
                    sessionStorage.setItem("role", "client");
                    navigate("/dashboard");
                }
            } else {
                // REGISTER client uniquement
                const payload = {
                    prenom: form.get("firstName"),
                    nom: form.get("lastName"),
                    email: form.get("email"),
                    telephone: form.get("phone"),
                    mot_de_passe: form.get("password"),
                };

                const res = await ClientService.createClient(payload);
                console.log("REGISTER RESPONSE:", res.data);

                setSuccess("Account created. Please sign in.");
                setMode("login");
                formElement.reset();
            }
        } catch (err) {
            console.log("AXIOS ERROR:", err?.response || err);

            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Request failed";

            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="auth">
                <div className="auth__intro">
                    <img src={logo} alt="Harmony Hotel" className="auth__logo" />
                    <p className="auth__brand">Harmony Hotel</p>
                    <p className="auth__tagline">A place to slow down and feel at home</p>
                </div>

                <Link to="/" className="auth__back">
                    ← Back to home
                </Link>

                <div className="auth__card">
                    <header className="auth__header">
                        <p className="auth__eyebrow">Harmony Hotel</p>
                        <h1 className="auth__title">
                            {isLogin ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="auth__subtitle">
                            {isLogin
                                ? "Sign in to manage your reservations."
                                : "Create an account to book and manage your stays."}
                        </p>
                    </header>

                    {error && <p className="auth__alert auth__alert--error">{error}</p>}
                    {success && <p className="auth__alert auth__alert--success">{success}</p>}

                    <div className="auth__tabs" role="tablist" aria-label="Authentication">
                        <button
                            className={`auth__tab ${isLogin ? "auth__tab--active" : ""}`}
                            type="button"
                            onClick={() => {
                                setMode("login");
                                setError("");
                                setSuccess("");
                            }}
                            role="tab"
                            aria-selected={isLogin}
                        >
                            Sign in
                        </button>

                        <button
                            className={`auth__tab ${!isLogin ? "auth__tab--active" : ""}`}
                            type="button"
                            onClick={() => {
                                setMode("register");
                                setError("");
                                setSuccess("");
                            }}
                            role="tab"
                            aria-selected={!isLogin}
                        >
                            Create account
                        </button>
                    </div>

                    <form className="auth__form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="auth__grid">
                                <div className="auth__field">
                                    <label className="auth__label" htmlFor="firstName">
                                        First name
                                    </label>
                                    <input
                                        className="auth__input-a"
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        required
                                    />
                                </div>

                                <div className="auth__field">
                                    <label className="auth__label" htmlFor="lastName">
                                        Last name
                                    </label>
                                    <input
                                        className="auth__input-a"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="auth__field">
                                <label className="auth__label" htmlFor="phone">
                                    Phone
                                </label>
                                <input
                                    className="auth__input"
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                        )}

                        <div className="auth__field">
                            <label className="auth__label" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="auth__input"
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="auth__field">
                            <label className="auth__label" htmlFor="password">
                                Password
                            </label>
                            <div className="auth__input-wrap">
                                <input
                                    className="auth__input"
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="auth__eye"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Masquer" : "Afficher"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <p className="auth__hint">Password must be at least 6 characters.</p>
                        )}

                        <button className="auth__submit" type="submit" disabled={loading}>
                            {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                        </button>

                        <p className="auth__footnote">
                            {isLogin ? "No account yet?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                className="auth__link"
                                onClick={() => setMode(isLogin ? "register" : "login")}
                            >
                                {isLogin ? "Create one" : "Sign in"}
                            </button>
                        </p>
                    </form>
                </div>
            </section>

            <Footer />
        </>
    );
}
