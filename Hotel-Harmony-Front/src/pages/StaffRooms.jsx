import { useEffect, useState } from "react";
import RoomService from "../services/RoomService";
import StaffMenu from "../components/StaffMenu";
import RoomModal from "../components/RoomModal";
import PhotoService from "../services/PhotoService";
import "../css/StaffRooms.css";

export default function StaffRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [modalLoading, setModalLoading] = useState(false);
    const [current, setCurrent] = useState(null);

    function showToast(message) {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    }

    async function resolvePhotosForRoom(roomId, form) {
        const orderedItems = Array.isArray(form.galleryItems) ? form.galleryItems : [];
        const newItems = orderedItems.filter((item) => item.kind === "new" && item.file);

        let uploadedPhotosByKey = new Map();

        if (newItems.length > 0) {
            const uploadRes = await PhotoService.uploadRoomPhotos(
                roomId,
                newItems.map((item) => item.file)
            );
            const uploadedPhotos = uploadRes.data?.photos || [];
            uploadedPhotosByKey = new Map(
                newItems.map((item, index) => [item.key, uploadedPhotos[index]?.url_photo || null])
            );
        }

        const nextPhotos = orderedItems
            .map((item) => {
                if (item.kind === "existing") return item.url_photo;
                return uploadedPhotosByKey.get(item.key) || null;
            })
            .filter(Boolean);

        if (form.coverSelection) {
            const coverIndex = orderedItems.findIndex((item) => item.key === form.coverSelection);
            const coverUrl = coverIndex >= 0 ? nextPhotos[coverIndex] : null;

            if (coverUrl) {
                const urlIndex = nextPhotos.indexOf(coverUrl);
                if (urlIndex > 0) {
                    nextPhotos.splice(urlIndex, 1);
                    nextPhotos.unshift(coverUrl);
                }
            }
        }

        return [...new Set(nextPhotos)];
    }

    async function load() {
        setLoading(true);
        try {
            const res = await RoomService.getAllRoomsStaff();
            setRooms(res.data);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load rooms");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setModalMode("create");
        setCurrent(null);
        setModalOpen(true);
    }

    function openEdit(room) {
        setModalMode("edit");
        setCurrent(room);
        setModalOpen(true);
    }

    async function submitRoom(form) {
        const payload = {
            numero: form.numero,
            prix: form.prix,
            capacite: form.capacite,
            statut: form.statut,
            id_type: form.id_type,
            services: form.services || [],
        };

        setModalLoading(true);

        try {
            if (modalMode === "create") {
                const createRes = await RoomService.createRoom(payload);
                const roomId = createRes.data?.chambre?.insertId;

                if (roomId) {
                    const nextPhotos = await resolvePhotosForRoom(roomId, form);
                    await PhotoService.replaceRoomPhotos(roomId, nextPhotos);
                }

                showToast("Room created ✅");
                setModalOpen(false);
                setCurrent(null);
                await load();
                return;
            }

            if (!current) return;

            await RoomService.updateRoom(current.id_chambre, payload);

            const nextPhotos = await resolvePhotosForRoom(current.id_chambre, form);
            await PhotoService.replaceRoomPhotos(current.id_chambre, nextPhotos);

            setRooms((prev) =>
                prev.map((r) =>
                    r.id_chambre === current.id_chambre ? { ...r, ...payload } : r
                )
            );

            setModalOpen(false);
            setCurrent(null);
            showToast("Room updated ✅");
            await load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Save failed");
        } finally {
            setModalLoading(false);
        }
    }

    async function handleToggleStatut(room) {
        const id = room.id_chambre;
        const currentStatut = room.statut || "active";
        const nextStatut =
            currentStatut === "active" ? "desactivee" : "active";

        try {
            setActionLoadingId(id);

            await RoomService.setRoomStatut(id, nextStatut);

            setRooms((prev) =>
                prev.map((r) =>
                    r.id_chambre === id ? { ...r, statut: nextStatut } : r
                )
            );

            showToast("Status updated ✅");
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to update status");
        } finally {
            setActionLoadingId(null);
        }
    }

    const filteredRooms = rooms.filter((room) => {
        if (statusFilter === "all") return true;
        return room.statut === statusFilter;
    });

    return (
        <section className="staffRooms">
            <div className="staffRooms__container">
                <header className="staffRooms__header">
                    <h1 className="staffRooms__title">Rooms management</h1>

                    <div className="staffRooms__headerActions">
                        <select
                            className="staffRooms__filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="desactivee">Disabled</option>
                        </select>

                        <StaffMenu />

                        <button
                            className="staffRooms__addBtn"
                            type="button"
                            onClick={openCreate}
                        >
                            + Add room
                        </button>
                    </div>
                </header>

                {toast && <p className="staffRooms__toast">{toast}</p>}
                {loading && <p>Loading...</p>}
                {!loading && filteredRooms.length === 0 && (
                    <p>No rooms found.</p>
                )}

                {!loading && filteredRooms.length > 0 && (
                    <div className="staffRooms__list">
                        {filteredRooms.map((room) => (
                            <article
                                key={room.id_chambre}
                                className="staffRooms__card"
                            >
                                <div className="staffRooms__cardTop">
                                    <h3>
                                        Room {room.numero || room.id_chambre}
                                    </h3>
                                    <span className={`staffRooms__status ${room.statut}`}>
                                        {room.statut === "active" ? "Active" : "Disabled"}
                                    </span>
                                </div>

                                <p>Type: {room.type_chambre}</p>
                                <p>Capacity: {room.capacite}</p>
                                <p>Price: {room.prix} €</p>
                                {room.services && <p>Services: {room.services}</p>}

                                <div className="staffRooms__actions">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(room)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatut(room)}
                                        disabled={
                                            actionLoadingId === room.id_chambre
                                        }
                                    >
                                        {(room.statut || "active") === "active"
                                            ? "Disable"
                                            : "Enable"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <RoomModal
                open={modalOpen}
                mode={modalMode}
                title={
                    modalMode === "create"
                        ? "Create room"
                        : "Edit room"
                }
                initial={current}
                loading={modalLoading}
                onClose={() => {
                    if (modalLoading) return;
                    setModalOpen(false);
                    setCurrent(null);
                }}
                onSubmit={submitRoom}
            />
        </section>
    );
}
