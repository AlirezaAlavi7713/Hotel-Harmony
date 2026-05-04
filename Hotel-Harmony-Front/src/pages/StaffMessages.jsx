import { useEffect, useState } from "react";
import ContactStaffService from "../services/ContactStaffService";
import StaffMenu from "../components/StaffMenu";
import "../css/StaffMessages.css";
import { useNavigate } from "react-router-dom";

export default function StaffMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [actionLoadingId, setActionLoadingId] = useState(null);

    // ✅ reply UI state
    const [replyOpenId, setReplyOpenId] = useState(null);
    const [replyText, setReplyText] = useState("");

    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await ContactStaffService.getMessages();
            setMessages(res.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load messages");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleMarkAsRead(id) {
        try {
            setActionLoadingId(id);
            await ContactStaffService.markAsRead(id);
            await load();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update message");
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleSaveReply(id) {
        const txt = replyText.trim();

        try {
            setActionLoadingId(id);
            setError("");
            await ContactStaffService.reply(id, txt);
            setReplyOpenId(null);
            setReplyText("");
            await load();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to save reply");
        } finally {
            setActionLoadingId(null);
        }
    }

    function badgeClass(statut) {
        if (statut === "non_lu") return "staffMessages__badge--unread";
        if (statut === "repondu") return "staffMessages__badge--replied";
        return "staffMessages__badge--read";
    }

    function badgeLabel(statut) {
        if (statut === "non_lu") return "Unread";
        if (statut === "repondu") return "Replied";
        return "Read";
    }

    return (
        <section className="staffMessages">
            <div className="staffMessages__container">
                <header className="staffMessages__header">
                    <h1 className="staffMessages__title">Contact messages</h1>
                    <StaffMenu />
                </header>

                {loading && <p className="staffMessages__muted">Loading...</p>}
                {error && <p className="staffMessages__error">{error}</p>}

                {!loading && !error && messages.length === 0 && (
                    <p className="staffMessages__muted">No messages.</p>
                )}

                {!loading &&
                    !error &&
                    messages.map((m) => (
                        <article className="staffMessages__card" key={m.id_message}>
                            <div className="staffMessages__cardTop">
                                <h3 className="staffMessages__subject">{m.sujet}</h3>

                                <span className={`staffMessages__badge ${badgeClass(m.statut)}`}>
                                    {badgeLabel(m.statut)}
                                </span>
                            </div>

                            <p className="staffMessages__meta">
                                {m.nom} — {m.email} — {new Date(m.created_at).toLocaleString()}
                            </p>

                            <p className="staffMessages__message">{m.message}</p>

                            {/* ✅ show reply if exists */}
                            {m.statut === "repondu" && m.reponse && (
                                <div className="staffMessages__reply">
                                    <p className="staffMessages__replyTitle">Reply</p>
                                    <p className="staffMessages__replyText">{m.reponse}</p>
                                </div>
                            )}

                            <div className="staffMessages__actions">
                                {/* Mark as read */}
                                {m.statut === "non_lu" && (
                                    <button
                                        className="staffMessages__btn"
                                        type="button"
                                        disabled={actionLoadingId === m.id_message}
                                        onClick={() => handleMarkAsRead(m.id_message)}
                                    >
                                        {actionLoadingId === m.id_message ? "Updating..." : "Mark as read"}
                                    </button>
                                )}

                                {/* Reply button (only if not replied) */}
                                {m.statut !== "repondu" && (
                                    <button
                                        className="staffMessages__btn staffMessages__btn--primary"
                                        type="button"
                                        onClick={() => {
                                            setError("");
                                            setReplyOpenId(m.id_message);
                                            setReplyText("");
                                        }}
                                        disabled={actionLoadingId === m.id_message}
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>

                            {/* ✅ Reply box */}
                            {replyOpenId === m.id_message && (
                                <div className="staffMessages__replyBox">
                                    <textarea
                                        className="staffMessages__textarea"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply… (saved in DB)"
                                        rows={4}
                                    />

                                    <div className="staffMessages__replyActions">
                                        <button
                                            className="staffMessages__btn"
                                            type="button"
                                            onClick={() => {
                                                setReplyOpenId(null);
                                                setReplyText("");
                                            }}
                                            disabled={actionLoadingId === m.id_message}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="staffMessages__btn staffMessages__btn--primary"
                                            type="button"
                                            disabled={actionLoadingId === m.id_message}
                                            onClick={() => handleSaveReply(m.id_message)}
                                        >
                                            {actionLoadingId === m.id_message ? "Saving..." : "Save reply"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
            </div>
        </section>
    );
}
