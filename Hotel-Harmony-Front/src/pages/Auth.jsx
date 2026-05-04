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
                localStorage.setItem("token", res.token);

                // Redirection selon le type
                if (res.type === "staff") {
                    // role = "admin" ou "employe"
                    localStorage.setItem("role", res.role);
                    localStorage.setItem("staffId", String(res.id_employe));
                    navigate("/staff");
                } else {
                    localStorage.setItem("role", "client");
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
                            <input
                                className="auth__input"
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                minLength={6}
                            />
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
