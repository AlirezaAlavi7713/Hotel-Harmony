import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/RoomDetails.css";
import RoomService from "../services/RoomService";
import ReservationService from "../services/ReservationService";
import { buildMediaUrl } from "../utils/media";
import PhotoService from "../services/PhotoService";

const ROOM_COPY = {
    simple: {
        title: "Simple Room",
        description:
            "A calm, efficient room designed for solo travelers and short business stays, with a soft palette and everything needed for a restful night.",
    },
    double: {
        title: "Double Room",
        description:
            "A balanced room for couples or two guests, combining generous comfort, warm materials and a layout that feels easy to settle into.",
    },
    suite: {
        title: "Suite",
        description:
            "A more expansive stay with a refined lounge feel, elevated finishes and extra room to relax, work or celebrate a special trip.",
    },
    default: {
        title: "Premium Room",
        description:
            "A quiet and elegant space designed for rest and comfort, with natural light, refined materials and the essentials of a polished hotel stay.",
    },
};

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

function parseServices(services) {
    return String(services || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function formatDateLabel(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function countNights(start, end) {
    if (!start || !end) return 0;
    const from = new Date(start);
    const to = new Date(end);
    const diff = to - from;
    if (Number.isNaN(diff) || diff <= 0) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24));
}

export default function RoomDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showBooking, setShowBooking] = useState(false);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" | "error"
    const [gallery, setGallery] = useState([]);
    const [activeImage, setActiveImage] = useState("");
    const [lightboxOpen, setLightboxOpen] = useState(false);

    function galleryImagesForDisplay(roomData, galleryItems, fallback) {
        if (galleryItems.length > 0) return galleryItems;
        const cover = buildMediaUrl(roomData?.url_photo);
        return cover ? [cover] : [fallback];
    }

    function openLightbox(image) {
        setActiveImage(image);
        setLightboxOpen(true);
    }

    function closeLightbox() {
        setLightboxOpen(false);
    }

    function changeLightboxImage(direction, images) {
        if (!images.length) return;
        const currentIndex = Math.max(images.indexOf(activeImage), 0);
        const nextIndex =
            direction === "next"
                ? (currentIndex + 1) % images.length
                : (currentIndex - 1 + images.length) % images.length;
        setActiveImage(images[nextIndex]);
    }

    async function handleReservation(e) {
        e.preventDefault();
        setMessage("");

        const token = sessionStorage.getItem("token");
        if (!token) {
            setMessageType("error");
            setMessage("You must be logged in to make a reservation.");
            return;
        }

        try {
            const res = await ReservationService.createReservation({
                id_chambre: room.id_chambre || room.id,
                date_debut: checkIn,
                date_fin: checkOut
            });


            // ⚠️ important
            const reservationId = res.data.id_reservation;
            navigate(`/payment/${reservationId}`);

            setMessageType("success");
            setMessage("Reservation created! You can view it in your dashboard.");
            setShowBooking(false);
        } catch (err) {
            if (err?.response?.status === 401) {
                setMessageType("error");
                setMessage("You must be logged in to make a reservation.");
                return;
            }

            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Reservation failed";

            setMessageType("error");
            setMessage(msg);
        }
    }

    useEffect(() => {
        setLoading(true);
        setError("");

        Promise.all([
            RoomService.getRoomById(id),
            PhotoService.getRoomPhotos(id),
        ])
            .then(([roomRes, photosRes]) => {
                const nextRoom = roomRes.data;
                const nextGallery = (photosRes.data || [])
                    .map((photo) => buildMediaUrl(photo.url_photo))
                    .filter(Boolean);

                setRoom(nextRoom);
                setGallery(nextGallery);

                const coverImage = nextGallery[0] || buildMediaUrl(nextRoom?.url_photo);
                setActiveImage(coverImage || "");
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Room not found";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!lightboxOpen) return undefined;

        function onKeyDown(event) {
            if (event.key === "Escape") {
                closeLightbox();
            }
        }

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [lightboxOpen]);

    if (loading) return <p className="roomDetails__muted">Loading...</p>;
    if (error) return <p className="roomDetails__error">{error}</p>;
    if (!room) return null;

    const fallbackImage =
        "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100b?auto=format&fit=crop&w=1200&q=80";
    const imageToShow = activeImage || buildMediaUrl(room.url_photo) || fallbackImage;
    const displayGallery = galleryImagesForDisplay(room, gallery, fallbackImage);
    const roomCopy = getRoomCopy(room.type || room.type_chambre);
    const serviceBadges = parseServices(room.services);
    const nights = countNights(checkIn, checkOut);
    const totalPrice = nights > 0 ? Number(room.prix || room.price || 0) * nights : 0;
    const today = new Date().toISOString().split("T")[0];

    return (
        <section className="roomDetails">
            <div className="roomDetails__container">

                <div className="roomDetails__media">
                    <img
                        className="roomDetails__image"
                        src={imageToShow}
                        alt={`Room ${room.numero}`}
                        onClick={() => openLightbox(imageToShow)}
                    />

                    {displayGallery.length > 1 && (
                        <div className="roomDetails__thumbs">
                            {displayGallery.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    className={`roomDetails__thumbBtn ${imageToShow === image ? "is-active" : ""}`}
                                    type="button"
                                    onClick={() => setActiveImage(image)}
                                >
                                    <img
                                        className="roomDetails__thumb"
                                        src={image}
                                        alt={`Room ${room.numero} view ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* infos */}
                <div className="roomDetails__content">
                    <p className="roomDetails__eyebrow">Harmony Hotel</p>

                    <h1 className="roomDetails__title">
                        {room.nom || room.name || roomCopy.title || `Room ${room.numero}`}
                    </h1>

                    <p className="roomDetails__meta">
                        {room.type || room.type_chambre || "Premium room"} •{" "}
                        {room.capacite || room.guests || "2"} guests
                    </p>

                    {serviceBadges.length > 0 && (
                        <div className="roomDetails__badges">
                            {serviceBadges.map((service) => (
                                <span className="roomDetails__badge" key={service}>
                                    {service}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="roomDetails__description">
                        {roomCopy.description}
                    </p>

                    <p className="roomDetails__price">
                        {room.prix || room.price || "--"} / night
                    </p>

                    <button
                        className="roomDetails__book"
                        onClick={() => setShowBooking(true)}
                    >
                        Book this room
                    </button>

                    {message && (
                        <p className={`roomDetails__message ${messageType === "error" ? "is-error" : "is-success"}`}>
                            {message}
                        </p>
                    )}

                    {showBooking && (
                        <form className="roomDetails__booking" onSubmit={handleReservation}>
                            <div className="roomDetails__bookingTop">
                                <div>
                                    <p className="roomDetails__sectionLabel">Reservation dates</p>
                                    <p className="roomDetails__bookingHint">
                                        Choose your arrival and departure dates to confirm your stay.
                                    </p>
                                </div>
                                {nights > 0 && (
                                    <div className="roomDetails__bookingSummary">
                                        <span>{nights} night{nights > 1 ? "s" : ""}</span>
                                        <strong>{totalPrice} € total</strong>
                                    </div>
                                )}
                            </div>

                            <div className="roomDetails__fields">
                                <div className="roomDetails__field">
                                    <label>Check in</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={today}
                                        required
                                    />
                                    <p>{checkIn ? formatDateLabel(checkIn) : "Arrival date"}</p>
                                </div>

                                <div className="roomDetails__field">
                                    <label>Check out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || today}
                                        required
                                    />
                                    <p>{checkOut ? formatDateLabel(checkOut) : "Departure date"}</p>
                                </div>
                            </div>

                            <div className="roomDetails__bookingNote">
                                Breakfast and hotel services can be finalized after reservation confirmation.
                            </div>

                            <button className="roomDetails__confirm">Confirm reservation</button>
                        </form>
                    )}
                </div>

            </div>

            {lightboxOpen && (
                <div className="roomDetails__lightbox" role="dialog" aria-modal="true">
                    <button
                        className="roomDetails__lightboxBackdrop"
                        type="button"
                        onClick={closeLightbox}
                        aria-label="Close gallery"
                    />

                    <div className="roomDetails__lightboxContent">
                        <button
                            className="roomDetails__lightboxClose"
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close gallery"
                        >
                            x
                        </button>

                        {displayGallery.length > 1 && (
                            <button
                                className="roomDetails__lightboxNav roomDetails__lightboxNav--prev"
                                type="button"
                                onClick={() => changeLightboxImage("prev", displayGallery)}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                        )}

                        <img
                            className="roomDetails__lightboxImage"
                            src={activeImage}
                            alt={`Room ${room.numero}`}
                        />

                        {displayGallery.length > 1 && (
                            <button
                                className="roomDetails__lightboxNav roomDetails__lightboxNav--next"
                                type="button"
                                onClick={() => changeLightboxImage("next", displayGallery)}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        )}

                        {displayGallery.length > 1 && (
                            <div className="roomDetails__lightboxThumbs">
                                {displayGallery.map((image, index) => (
                                    <button
                                        key={`lightbox-${image}-${index}`}
                                        className={`roomDetails__lightboxThumbBtn ${activeImage === image ? "is-active" : ""}`}
                                        type="button"
                                        onClick={() => setActiveImage(image)}
                                    >
                                        <img
                                            className="roomDetails__lightboxThumb"
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
