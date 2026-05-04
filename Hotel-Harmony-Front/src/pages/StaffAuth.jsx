import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css"; // tu peux réutiliser le même css pour commencer
import EmployeService from "../services/EmployeService";

export default function StaffAuth() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const payload = {
        email: form.get("email"),
        mot_de_passe: form.get("password"),
      };

      const res = await EmployeService.login(payload);

      // stocker exactement comme client
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // "employe" ou "admin"
      localStorage.setItem("staffId", res.data.id_employe);

      navigate("/staff");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <header className="auth__header">
          <p className="auth__eyebrow">Harmony Hotel</p>
          <h1 className="auth__title">Staff sign in</h1>
          <p className="auth__subtitle">Employees and admins only.</p>
        </header>

        {error && <p className="auth__alert auth__alert--error">{error}</p>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="email">Email</label>
            <input className="auth__input" id="email" name="email" type="email" required />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="password">Password</label>
            <input className="auth__input" id="password" name="password" type="password" required />
          </div>

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}