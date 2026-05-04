import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashStaff.css";
import ReservationService from "../services/ReservationService";
import ConfirmModal from "../components/ConfirmModal";
import StaffMenu from "../components/StaffMenu";

export default function DashStaff() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role"); // admin/employe

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [reservationToCancel, setReservationToCancel] = useState(null);
    const [toast, setToast] = useState("");

    function showToast(message) {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    }

    // cette fonction sert pour quand le back repond 401 (token invalide ou expiré) donc le front vide la session et envoievers le front
    function kickToAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("clientId");
        localStorage.removeItem("staffId");
        navigate("/auth");
    }

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    function statusLabel(statut) {
        if (statut === "en_attente") return "Pending";
        if (statut === "confirmee") return "Confirmed";
        if (statut === "annulee") return "Cancelled";
        return statut || "-";
    }

    async function loadReservations() {
        setLoading(true);
        setError("");

        try {
            const res = await ReservationService.getAllReservations();
            setReservations(res.data);
        } catch (err) {
            const status = err?.response?.status;

            if (status === 401) {
                kickToAuth();
                return;
            }

            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to load reservations";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        return reservations
            .filter((r) => (statusFilter === "all" ? true : r.statut === statusFilter))
            .filter((r) => {
                if (!search.trim()) return true;
                const s = search.toLowerCase();
                const fullName = `${r.client_prenom || ""} ${r.client_nom || ""}`.toLowerCase();
                const room = String(r.chambre_numero || "").toLowerCase();
                const id = String(r.id_reservation || "").toLowerCase();
                return fullName.includes(s) || room.includes(s) || id.includes(s);
            });
    }, [reservations, statusFilter, search]);

    function askCancel(id_reservation) {
        setError("");
        setReservationToCancel(id_reservation);
    }

    async function confirmCancel() {
        if (!reservationToCancel) return;

        setActionLoadingId(reservationToCancel);
        setError("");

        try {
            await ReservationService.cancelReservation(reservationToCancel);
            setReservationToCancel(null);
            showToast("Reservation cancelled ✅");
            await loadReservations();
        } catch (err) {
            const status = err?.response?.status;

            if (status === 401) {
                kickToAuth();
                return;
            }

            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Cancel failed";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    }

    return (
        <section className="staff">
            <div className="staff__container">
                <header className="staff__header">
                    <div>
                        <p className="staff__eyebrow">Harmony Hotel</p>
                        <h1 className="staff__title">Staff dashboard</h1>
                        <p className="staff__subtitle">Manage reservations.</p>
                    </div>

                    <div className="staff__filters">
                        <input
                            className="staff__search"
                            type="text"
                            placeholder="Search (guest, room, id)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="staff__select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="en_attente">Pending</option>
                            <option value="confirmee">Confirmed</option>
                            <option value="annulee">Cancelled</option>
                        </select>

                        <StaffMenu />
                    </div>
                </header>

                {toast && <p className="staff__toast">{toast}</p>}

                {loading && <p className="staff__muted">Loading...</p>}
                {error && <p className="staff__error">{error}</p>}

                {!loading && !error && filtered.length === 0 && (
                    <p className="staff__muted">No reservations found.</p>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="staff__list">
                        {filtered.map((r) => (
                            <article className="staff__card" key={r.id_reservation}>
                                <div className="staff__cardTop">
                                    <p className="staff__cardTitle">Reservation #{r.id_reservation}</p>
                                    <span className={`staff__status staff__status--${r.statut}`}>
                                        {statusLabel(r.statut)}
                                    </span>
                                </div>

                                <div className="staff__grid">
                                    <div>
                                        <p className="staff__label">Guest</p>
                                        <p className="staff__value">{r.client_prenom} {r.client_nom}</p>
                                    </div>

                                    <div>
                                        <p className="staff__label">Room</p>
                                        <p className="staff__value">{r.chambre_numero ?? "-"}</p>
                                    </div>

                                    <div>
                                        <p className="staff__label">Check-in</p>
                                        <p className="staff__value">{formatDate(r.date_debut)}</p>
                                    </div>

                                    <div>
                                        <p className="staff__label">Check-out</p>
                                        <p className="staff__value">{formatDate(r.date_fin)}</p>
                                    </div>
                                </div>

                                <div className="staff__actions">
                                    <button
                                        className="staff__btn"
                                        type="button"
                                        onClick={() => navigate(`/reservation/${r.id_reservation}`)}
                                    >
                                        View details
                                    </button>

                                    <button
                                        className="staff__btn staff__btn--danger"
                                        type="button"
                                        onClick={() => askCancel(r.id_reservation)}
                                        disabled={r.statut === "annulee"}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                open={reservationToCancel !== null}
                title="Cancel reservation"
                message="This will cancel the booking immediately. Do you want to continue?"
                confirmText="Cancel reservation"
                cancelText="Keep reservation"
                loading={actionLoadingId !== null}
                onClose={() => setReservationToCancel(null)}
                onConfirm={confirmCancel}
            />
        </section>
    );
}