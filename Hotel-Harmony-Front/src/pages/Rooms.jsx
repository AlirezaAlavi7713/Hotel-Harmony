import { useEffect, useState } from "react";
import "../css/Rooms.css";
import RoomService from "../services/RoomService";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { buildMediaUrl } from "../utils/media";

const ROOM_COPY = {
    simple: {
        title: "Simple Room",
        description: "A quiet and efficient stay for solo travel, short city breaks and simple comfort.",
    },
    double: {
        title: "Double Room",
        description: "A warmer setup for two guests, with more breathing room and a balanced layout.",
    },
    suite: {
        title: "Suite",
        description: "A spacious premium stay with extra comfort, refined details and a more elevated atmosphere.",
    },
    default: {
        title: "Premium Room",
        description: "A polished room designed for calm, privacy and an easy hotel experience.",
    },
};

const FIXED_SERVICES = [
    "Wi-Fi",
    "Petit dejeuner",
    "Piscine",
];

function normalizeRoomType(type) {
    return String(type || "").trim().toLowerCase();
}

function getRoomCopy(type) {
    const normalized = normalizeRoomType(type);
    if (normalized.includes("suite")) return ROOM_COPY.suite;
    if (normalized.includes("double")) return ROOM_COPY.double;
    if (normalized.includes("simple") || normalized.includes("single")) return ROOM_COPY.simple;
    return ROOM_COPY.default;
}

function getIncludedServices(type) {
    const normalized = normalizeRoomType(type);
    if (normalized.includes("suite")) return ["Wi-Fi", "Petit dejeuner", "Piscine"];
    if (normalized.includes("double")) return ["Wi-Fi", "Petit dejeuner"];
    if (normalized.includes("simple") || normalized.includes("single")) return ["Wi-Fi"];
    return ["Wi-Fi"];
}

export default function Rooms() {
    const location = useLocation();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchState = location.state;
    const date_debut = searchState?.date_debut || "";
    const date_fin = searchState?.date_fin || "";
    const personnes = Number(searchState?.personnes || 1);
    const hasFilters = Boolean(date_debut && date_fin);

    useEffect(() => {
        setLoading(true);
        setError("");

        const request = hasFilters // hasFilters ? ... : ...   c'est un operateur ternaire
            ? RoomService.getAvailableRooms({ date_debut, date_fin, personnes })
            : RoomService.getAllRooms();

        request
            .then((res) => {
                setRooms(res.data);
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load rooms";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [date_debut, date_fin, personnes, hasFilters]);

    return (
        <>
            <section className="rooms">
                <div className="rooms__container">
                    <header className="rooms__header">
                        <p className="rooms__eyebrow">Rooms & Suites</p>
                        <h1 className="rooms__title">Find your perfect stay</h1>
                        <p className="rooms__subtitle">
                            {hasFilters
                                ? `Available rooms from ${date_debut} to ${date_fin} for ${personnes} guest${personnes > 1 ? "s" : ""}.`
                                : "Minimal comfort, premium calm. Select a room to view details."}
                        </p>
                    </header>

                    {loading && <p className="rooms__muted">Loading...</p>}
                    {error && <p className="rooms__error">{error}</p>}
                    {!loading && !error && rooms.length === 0 && hasFilters && (
                        <p className="rooms__muted">No rooms are available for these dates and this number of guests.</p>
                    )}

                    {!loading && !error && rooms.length > 0 && (
                        <section className="rooms__grid">
                            {rooms.map((room) => (
                                <article className="rooms__card" key={room.id_chambre || room.id}>
                                    <img
                                        className="rooms__image"
                                        src={buildMediaUrl(room.url_photo)}
                                        alt={room.nom || room.name || `Room ${room.numero}`}
                                    />

                                    <div className="rooms__content">
                                        <div className="rooms__top">
                                            <div>
                                                <p className="rooms__type">{room.type || room.type_chambre || "Premium room"}</p>
                                                <p className="rooms__name">
                                                    {room.nom || room.name || getRoomCopy(room.type || room.type_chambre).title || `Room ${room.numero}`}
                                                </p>
                                            </div>

                                            <div className="rooms__priceBox">
                                                <span>From</span>
                                                <strong>{room.prix || room.price || "--"} €</strong>
                                                <small>/ night</small>
                                            </div>
                                        </div>

                                        <p className="rooms__meta">
                                            {room.capacite || room.guests || "2"} guests
                                        </p>

                                        <p className="rooms__description">
                                            {getRoomCopy(room.type || room.type_chambre).description}
                                        </p>

                                        <div className="rooms__badges">
                                            {FIXED_SERVICES.map((service) => {
                                                const isAvailable = getIncludedServices(
                                                    room.type || room.type_chambre
                                                ).includes(service);

                                                return (
                                                    <span
                                                        className={`rooms__badge ${isAvailable ? "" : "rooms__badge--soft"}`}
                                                        key={service}
                                                    >
                                                        {service}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <div className="rooms__footer">
                                            <p className="rooms__note">
                                                Breakfast and hotel services can be finalized after booking.
                                            </p>

                                            <Link className="rooms__btn" to={`/rooms/${room.id_chambre || room.id}`}>
                                                View details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}
