import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Payment.css";
import PaymentService from "../services/PaymentService";
import ReservationService from "../services/ReservationService";

export default function Payment() {
    const { id } = useParams(); // id_reservation
    const navigate = useNavigate();
    const search = new URLSearchParams(window.location.search);
    const paymentStatus = search.get("status");

    const [loading, setLoading] = useState(true);
    const [payLoading, setPayLoading] = useState(false);
    const [error, setError] = useState("");
    const [payment, setPayment] = useState(null);

    // ✅ blocage si réservation déjà payée/confirmée/annulée
    const [blocked, setBlocked] = useState(false);
    const [blockedMessage, setBlockedMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let timeoutId = null;
        let cancelled = false;

        setLoading(true);
        setError("");
        setBlocked(false);
        setBlockedMessage("");
        setSuccessMessage("");
        setPayment(null);

        if (paymentStatus === "success") {
            const pollReservation = async () => {
                try {
                    const res = await ReservationService.getReservationById(Number(id));
                    const reservation = res.data;

                    if (cancelled) return;

                    if (reservation?.statut === "confirmee") {
                        setBlocked(true);
                        setBlockedMessage("Payment confirmed. Your reservation is now confirmed.");
                        setSuccessMessage("Stripe payment received successfully.");
                        setLoading(false);
                        return;
                    }

                    timeoutId = window.setTimeout(pollReservation, 1500);
                } catch (err) {
                    if (cancelled) return;
                    const msg =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        "Unable to verify payment status";
                    setError(msg);
                    setLoading(false);
                }
            };

            pollReservation();

            return () => {
                cancelled = true;
                if (timeoutId) window.clearTimeout(timeoutId);
            };
        }

        if (paymentStatus === "cancel") {
            setBlocked(true);
            setBlockedMessage("Payment was cancelled. You can try again when you are ready.");
            setLoading(false);
            return undefined;
        }

        PaymentService.initPayment(Number(id))
            .then((res) => {
                setPayment(res.data);
            })
            .catch((err) => {
                const status = err?.response?.status;
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Payment init failed";

                if (status === 409) {
                    setBlocked(true);
                    setBlockedMessage("This reservation is already paid or can’t be paid anymore.");
                    return;
                }

                setError(msg);
            })
            .finally(() => setLoading(false));

        return () => {
            cancelled = true;
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [id, navigate, paymentStatus]);

    async function handlePay() {
        if (!payment?.checkout_url) return;

        setPayLoading(true);
        setError("");

        try {
            localStorage.setItem("stripe_redirect", "1");
        window.location.assign(payment.checkout_url);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Payment failed";
            setError(msg);
        } finally {
            setPayLoading(false);
        }
    }

    return (
        <section className="payment">
            <div className="payment__card">
                <p className="payment__eyebrow">Secure payment</p>
                <h1 className="payment__title">Confirm your stay</h1>
                <p className="payment__subtitle">
                    Your reservation will be confirmed after payment.
                </p>

                {loading && <p className="payment__muted">Loading payment...</p>}
                {error && <p className="payment__error">{error}</p>}
                {successMessage && <p className="payment__info">{successMessage}</p>}

                {!loading && blocked && (
                    <>
                        <p className="payment__info">{blockedMessage}</p>

                        <button
                            className="payment__btn"
                            type="button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to dashboard
                        </button>
                    </>
                )}

                {/* ✅ Paiement normal uniquement si pas bloqué */}
                {!loading && !error && payment && !blocked && (
                    <>
                        <div className="payment__summary">
                            <p className="payment__row">
                                <span>Amount</span>
                                <span>{payment.montant} €</span>
                            </p>

                            <p className="payment__row">
                                <span>Nights</span>
                                <span>{payment.nb_nuits}</span>
                            </p>

                            <p className="payment__row payment__row--muted">
                                <span>Method</span>
                                <span>Stripe Checkout</span>
                            </p>
                        </div>

                        <button
                            className="payment__btn"
                            type="button"
                            onClick={handlePay}
                            disabled={payLoading}
                        >
                            {payLoading ? "Processing..." : "Pay now"}
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
