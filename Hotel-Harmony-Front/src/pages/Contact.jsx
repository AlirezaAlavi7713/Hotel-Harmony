import { useMemo, useState } from "react";
import "../css/Contact.css";
import ContactService from "../services/ContactService";
import Footer from "../components/Footer";

export default function Contact() {
    const [form, setForm] = useState({
        nom: "",
        email: "",
        sujet: "",
        message: "",
    });

    const [status, setStatus] = useState({
        loading: false,
        error: "",
        success: "",
    });

    const canSubmit = useMemo(() => {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
        return (
            form.nom.trim().length >= 2 &&
            emailOk &&
            form.sujet.trim().length >= 3 &&
            form.message.trim().length >= 10
        );
    }, [form]);

    function onChange(e) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setStatus({ loading: true, error: "", success: "" });

        try {
            // ✅ Envoi réel au backend
            const payload = {
                nom: form.nom.trim(),
                email: form.email.trim(),
                sujet: form.sujet.trim(),
                message: form.message.trim(),
            };

            const res = await ContactService.sendMessage(payload);

            setStatus({
                loading: false,
                error: "",
                success: res?.data?.message || "Message sent ✅ We’ll get back to you soon.",
            });

            setForm({ nom: "", email: "", sujet: "", message: "" });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to send message. Please try again.";

            setStatus({ loading: false, error: msg, success: "" });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    return (
        <>
            <section className="contact">
                <article className="contact__hero">
                    <p className="contact__eyebrow">Harmony Hotel</p>
                    <h1 className="contact__title">Contact us</h1>
                    <p className="contact__subtitle">
                        A question about a stay, a reservation, or a special request? Send us a message.
                    </p>
                </article>

                <section className="contact__grid">
                    {/* LEFT: infos */}
                    <article className="contact__card contact__info">
                        <h2 className="contact__cardTitle">Hotel information</h2>

                        <div className="contact__infoList">
                            <div className="contact__infoItem">
                                <p className="contact__label">Address</p>
                                <p className="contact__value">Harmony Hotel, 12 Rue du Calme, 59000 Lille</p>
                            </div>

                            <div className="contact__infoItem">
                                <p className="contact__label">Phone</p>
                                <p className="contact__value">+33 3 20 00 00 00</p>
                            </div>

                            <div className="contact__infoItem">
                                <p className="contact__label">Email</p>
                                <p className="contact__value">contact@harmony-hotel.com</p>
                            </div>

                            <div className="contact__infoItem">
                                <p className="contact__label">Hours</p>
                                <p className="contact__value">Mon–Sun: 08:00 – 20:00</p>
                            </div>
                        </div>

                        <div className="contact__tip">
                            <p className="contact__tipTitle">Tip</p>
                            <p className="contact__tipText">
                                If your request is about a reservation, include the reservation ID in the subject.
                            </p>
                        </div>
                    </article>

                    {/* RIGHT: form */}
                    <article className="contact__card contact__formCard">
                        <h2 className="contact__cardTitle">Send a message</h2>

                        {status.error && (
                            <p className="contact__alert contact__alert--error">{status.error}</p>
                        )}
                        {status.success && (
                            <p className="contact__alert contact__alert--success">{status.success}</p>
                        )}

                        <form className="contact__form" onSubmit={onSubmit}>
                            <div className="contact__row">
                                <div className="contact__field">
                                    <label className="contact__label" htmlFor="nom">
                                        Name
                                    </label>
                                    <input
                                        id="nom"
                                        name="nom"
                                        className="contact__input_a"
                                        value={form.nom}
                                        onChange={onChange}
                                        placeholder="Your name"
                                        autoComplete="name"
                                        required
                                        minLength={2}
                                    />
                                </div>

                                <div className="contact__field">
                                    <label className="contact__label" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="contact__input_a"
                                        value={form.email}
                                        onChange={onChange}
                                        placeholder="you@email.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact__field">
                                <label className="contact__label" htmlFor="sujet">
                                    Subject
                                </label>
                                <input
                                    id="sujet"
                                    name="sujet"
                                    className="contact__input"
                                    value={form.sujet}
                                    onChange={onChange}
                                    placeholder="Reservation #123 / Special request / Question…"
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div className="contact__field">
                                <label className="contact__label" htmlFor="message">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="contact__textarea"
                                    value={form.message}
                                    onChange={onChange}
                                    placeholder="Write your message…"
                                    required
                                    minLength={10}
                                    rows={6}
                                />
                                <p className="contact__hint">
                                    Min. 10 characters. Keep it clear and we’ll reply faster.
                                </p>
                            </div>

                            <button className="contact__btn" type="submit" disabled={!canSubmit || status.loading}>
                                {status.loading ? "Sending…" : "Send message"}
                            </button>
                        </form>
                    </article>
                </section>
            </section>
         <Footer />
        </>
    );
}