import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashClient.css";
import ReservationService from "../services/ReservationService";
import ClientService from "../services/ClientService";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("reservations");
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [profileForm, setProfileForm] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");
    const [profileMsgType, setProfileMsgType] = useState("");

    const navigate = useNavigate();

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function countNights(start, end) {
        if (!start || !end) return 0;
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = d2 - d1;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    function calcTotal(reservation) {
        const nights = countNights(reservation.date_debut, reservation.date_fin);
        const prixNuit = Number(reservation.prix_nuit || 0);
        return Number((nights * prixNuit).toFixed(2));
    }

    const role = sessionStorage.getItem("role");

    useEffect(() => {
        if (activeTab !== "reservations") return;
        if (role !== "client") return;

        setLoading(true);
        setError("");

        ReservationService.getMyReservations()
            .then((res) => {
                setReservations(res.data);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || "Failed to load reservations");
            })
            .finally(() => setLoading(false));
    }, [activeTab, role]);

    useEffect(() => {
        if (activeTab !== "profile") return;

        setProfileLoading(true);
        setProfileMsg("");
        setProfileMsgType("");

        ClientService.getMe()
            .then((res) => {
                setProfileForm({
                    prenom: res.data?.prenom || "",
                    nom: res.data?.nom || "",
                    email: res.data?.email || "",
                    telephone: res.data?.telephone || "",
                });
            })
            .catch((err) => {
                setProfileMsgType("error");
                setProfileMsg(err?.response?.data?.message || "Failed to load profile");
            })
            .finally(() => setProfileLoading(false));
    }, [activeTab]);

    return (
        <section className="dash">
            <div className="dash__container">
                {/* Sidebar */}
                <aside className="dash__sidebar">
                    <div className="dash__brand">
                        <p className="dash__brandName">Harmony</p>
                        <p className="dash__brandSub">Client dashboard</p>
                    </div>

                    <nav className="dash__nav" aria-label="Dashboard navigation">
                        <button
                            className={`dash__navItem ${activeTab === "reservations" ? "is-active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("reservations")}
                        >
                            My reservations
                        </button>

                        <button
                            className={`dash__navItem ${activeTab === "profile" ? "is-active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile
                        </button>
                    </nav>
                </aside>

                {/* Main */}
                <main className="dash__main">
                    <header className="dash__header">
                        <h1 className="dash__title">
                            {activeTab === "reservations" ? "My reservations" : "Profile"}
                        </h1>
                        <p className="dash__subtitle">
                            {activeTab === "reservations"
                                ? "Manage your upcoming stays and past bookings."
                                : "Update your personal information."}
                        </p>
                    </header>

                    {/* Reservations */}
                    {activeTab === "reservations" && (
                        <div className="dash__panel">
                            {loading && <p className="dash__muted">Loading...</p>}
                            {error && <p className="dash__error">{error}</p>}

                            {!loading && !error && reservations.length === 0 && (
                                <p className="dash__muted">You have no reservations yet.</p>
                            )}

                            {!loading && !error && reservations.length > 0 && (
                                <div className="dash__list">
                                    {reservations.map((r) => (
                                        <article className="dash__card" key={r.id_reservation || r.id}>
                                            <div className="dash__cardTop">
                                                <div className="dash__cardSpacer" aria-hidden="true" />
                                                <span className={`dash__status dash__status--${r.statut}`}>
                                                    {r.statut === "en_attente" && "Pending"}
                                                    {r.statut === "confirmee" && "Confirmed"}
                                                    {r.statut === "annulee" && "Cancelled"}
                                                </span>
                                            </div>

                                            <div className="dash__cardGrid">
                                                <div>
                                                    <p className="dash__label">Check-in</p>
                                                    <p className="dash__value">{formatDate(r.date_debut || r.check_in)}</p>
                                                </div>
                                                <div>
                                                    <p className="dash__label">Check-out</p>
                                                    <p className="dash__value">{formatDate(r.date_fin || r.check_out)}</p>
                                                </div>
                                                <div>
                                                    <p className="dash__label">Room</p>
                                                    <p className="dash__value">{r.chambre_numero || r.room_number || "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="dash__label">Nights</p>
                                                    <p className="dash__value">
                                                        {countNights(r.date_debut || r.check_in, r.date_fin || r.check_out)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="dash__label">Total</p>
                                                    <p className="dash__value">{calcTotal(r)} €</p>
                                                </div>
                                            </div>

                                            <div className="dash__cardActions">
                                                <button
                                                    className="dash__btn dash__btn--outline"
                                                    type="button"
                                                    onClick={() => navigate(`/reservation/${r.id_reservation || r.id}`)}
                                                >
                                                    View details
                                                </button>

                                                {r.statut === "en_attente" && (
                                                    <button
                                                        className="dash__btn dash__btn--primary"
                                                        type="button"
                                                        onClick={() => navigate(`/payment/${r.id_reservation || r.id}`)}
                                                    >
                                                        Finalize payment
                                                    </button>
                                                )}

                                                <button
                                                    className="dash__btn dash__btn--danger"
                                                    type="button"
                                                    disabled={r.statut === "annulee"}
                                                    onClick={async () => {
                                                        const id = r.id_reservation || r.id;
                                                        try {
                                                            await ReservationService.cancelReservation(id);
                                                            const res = await ReservationService.getMyReservations();
                                                            setReservations(res.data);
                                                        } catch (err) {
                                                            const msg =
                                                                err?.response?.data?.message ||
                                                                err?.response?.data?.error ||
                                                                "Cancel failed";
                                                            setError(msg);
                                                        }
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile */}
                    {activeTab === "profile" && (
                        <div className="dash__panel">
                            {profileLoading && <p className="dash__muted">Loading...</p>}
                            {profileMsg && (
                                <p className={profileMsgType === "error" ? "dash__error" : "dash__success"}>
                                    {profileMsg}
                                </p>
                            )}

                            {!profileLoading && (
                                <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                                    <div>
                                        <p className="dash__label">First name</p>
                                        <input
                                            className="dash__input"
                                            value={profileForm.prenom}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, prenom: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <p className="dash__label">Last name</p>
                                        <input
                                            className="dash__input"
                                            value={profileForm.nom}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, nom: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <p className="dash__label">Email</p>
                                        <input
                                            className="dash__input"
                                            type="email"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <p className="dash__label">Phone</p>
                                        <input
                                            className="dash__input"
                                            value={profileForm.telephone}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, telephone: e.target.value }))}
                                        />
                                    </div>

                                    <button
                                        className="dash__btn dash__btn--primary"
                                        type="button"
                                        disabled={profileSaving}
                                        onClick={async () => {
                                            setProfileSaving(true);
                                            setProfileMsg("");
                                            setProfileMsgType("");
                                            try {
                                                await ClientService.updateMe(profileForm);
                                                setProfileMsgType("success");
                                                setProfileMsg("Profile updated ✅");
                                            } catch (err) {
                                                setProfileMsgType("error");
                                                setProfileMsg(err?.response?.data?.message || "Save failed");
                                            } finally {
                                                setProfileSaving(false);
                                            }
                                        }}
                                    >
                                        {profileSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
}
