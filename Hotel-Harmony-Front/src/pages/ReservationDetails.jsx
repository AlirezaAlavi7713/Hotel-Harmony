import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ReservationDetails.css";
import ReservationService from "../services/ReservationService";
import PhotoService from "../services/PhotoService";
import { buildMediaUrl } from "../utils/media";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [resa, setResa] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

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

  function statusLabel(statut) {
    if (statut === "en_attente") return "Pending";
    if (statut === "confirmee") return "Confirmed";
    if (statut === "annulee") return "Cancelled";
    return statut || "-";
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      setResa(null);
      setPhotoUrl(null);

      try {
        // 1) Reservation
        const resaRes = await ReservationService.getReservationById(Number(id));
        const reservation = resaRes.data;
        setResa(reservation);

        // 2) Cover photo (option B)
        if (reservation?.id_chambre) {
          const photoRes = await PhotoService.getRoomCoverPhoto(reservation.id_chambre);
          setPhotoUrl(photoRes.data?.url_photo || null);
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load reservation details";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleFinalize() {
    if (role === "admin" || role === "employe") {
      try {
        setActionLoading(true);
        setError("");
        await ReservationService.confirmReservationByStaff(Number(id));
        const resaRes = await ReservationService.getReservationById(Number(id));
        setResa(resaRes.data);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to finalize reservation";
        setError(msg);
      } finally {
        setActionLoading(false);
      }
      return;
    }

    navigate(`/payment/${id}`);
  }

  const placeholder =
    "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100b?auto=format&fit=crop&w=1200&q=80";

  const imageUrl = photoUrl
    ? buildMediaUrl(photoUrl)
    : placeholder;

  return (
    <section className="resaDetails">
      <article className="resaDetails__card">
        {loading && <p className="resaDetails__muted">Loading...</p>}
        {error && <p className="resaDetails__error">{error}</p>}

        {!loading && !error && resa && (
          <div className="resaDetails__layout">
            {/* LEFT: photo */}
            <div className="resaDetails__media">
              <img
                className="resaDetails__img"
                src={imageUrl}
                alt="Room"
                loading="lazy"
              />
            </div>

            {/* RIGHT: text */}
            <div className="resaDetails__content">
              <div className="resaDetails__top">
                <div>
                  <p className="resaDetails__eyebrow">Reservation details</p>
                  <h1 className="resaDetails__title">Reservation</h1>
                </div>

                <span className={`resaDetails__status resaDetails__status--${resa.statut}`}>
                  {statusLabel(resa.statut)}
                </span>
              </div>

              <div className="resaDetails__grid">
                <div>
                  <p className="resaDetails__label">Guest</p>
                  <p className="resaDetails__value">
                    {resa.client_prenom} {resa.client_nom}
                  </p>
                </div>

                <div>
                  <p className="resaDetails__label">Room</p>
                  <p className="resaDetails__value">
                    {resa.chambre_numero ?? resa.id_chambre ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="resaDetails__label">Check-in</p>
                  <p className="resaDetails__value">{formatDate(resa.date_debut)}</p>
                </div>

                <div>
                  <p className="resaDetails__label">Check-out</p>
                  <p className="resaDetails__value">{formatDate(resa.date_fin)}</p>
                </div>

                <div>
                  <p className="resaDetails__label">Nights</p>
                  <p className="resaDetails__value">
                    {countNights(resa.date_debut, resa.date_fin)}
                  </p>
                </div>

                <div>
                  <p className="resaDetails__label">Total</p>
                  <p className="resaDetails__value">{calcTotal(resa)} €</p>
                </div>
              </div>

              <div className="resaDetails__actions">
                <button
                  className="resaDetails__btn resaDetails__btn--outline"
                  type="button"
                  onClick={() => navigate(role === "admin" || role === "employe" ? "/staff" : "/dashboard")}
                >
                  Back to dashboard
                </button>

                {resa.statut === "en_attente" && (
                  <button
                    className="resaDetails__btn"
                    type="button"
                    onClick={handleFinalize}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Finalize payment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
