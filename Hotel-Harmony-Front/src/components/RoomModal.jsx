import { useEffect, useState } from "react";
import RoomService from "../services/RoomService";
import PhotoService from "../services/PhotoService";
import { buildMediaUrl } from "../utils/media";

export default function RoomModal({
    open,
    mode = "edit",
    title,
    initial = null,
    loading = false,
    onClose,
    onSubmit,
}) {
    const isCreate = mode === "create";

    const [types, setTypes] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [coverSelection, setCoverSelection] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const [form, setForm] = useState({
        numero: "",
        prix: "",
        capacite: "",
        statut: "active",
        id_type: "",
    });

    useEffect(() => {
        if (!open) return;

        async function loadData() {
            try {
                const requests = [
                    RoomService.getAllRoomTypes(),
                    RoomService.getAllServices(),
                ];

                if (initial?.id_chambre) {
                    requests.push(PhotoService.getRoomPhotos(initial.id_chambre));
                }

                const [typesRes, servicesRes, photosRes] = await Promise.all(requests);

                const nextExistingPhotos = (photosRes?.data || []).map((photo) => ({
                    kind: "existing",
                    key: `existing:${photo.id_photo}`,
                    id_photo: photo.id_photo,
                    url_photo: photo.url_photo,
                }));
                setTypes(typesRes.data);
                setServices(servicesRes.data);
                setGalleryItems(nextExistingPhotos);
                setCoverSelection(nextExistingPhotos[0]?.key || null);
            } catch (err) {
                console.error("Failed to load modal data");
            }
        }

        loadData();

        setForm({
            numero: initial?.numero ?? "",
            prix: initial?.prix ?? "",
            capacite: initial?.capacite ?? "",
            statut: initial?.statut ?? "active",
            id_type: initial?.id_type ?? "",
        });

        setSelectedServices(
            initial?.services_ids
                ? String(initial.services_ids)
                    .split(",")
                    .map((id) => Number(id))
                : []
        );

        setGalleryItems([]);
        setCoverSelection(null);
        setFileInputKey((prev) => prev + 1);

    }, [open, initial]);

    if (!open) return null;

    const canSubmit =
        String(form.numero).trim().length > 0 &&
        Number(form.prix) > 0 &&
        Number(form.capacite) > 0 &&
        (form.statut === "active" || form.statut === "desactivee") &&
        Number(form.id_type) > 0;

   function toggleService(id_service) {
    setSelectedServices((prev) => {
        const alreadySelected = prev.includes(id_service);

        if (alreadySelected) {
            return prev.filter((id) => id !== id_service);
        }

        return [...prev, id_service];
    });
}


    function handleSave() {
        onSubmit({
            numero: String(form.numero).trim(),
            prix: Number(form.prix),
            capacite: Number(form.capacite),
            statut: form.statut,
            id_type: Number(form.id_type),
            services: selectedServices,
            galleryItems,
            coverSelection,
        });
    }

    function removeGalleryItem(itemKey) {
        const nextGalleryItems = galleryItems.filter((item) => item.key !== itemKey);
        setGalleryItems(nextGalleryItems);

        if (coverSelection === itemKey) {
            if (nextGalleryItems[0]) {
                setCoverSelection(nextGalleryItems[0].key);
                return;
            }

            setCoverSelection(null);
        }

        if (nextGalleryItems.every((item) => item.kind !== "new")) {
            setFileInputKey((prev) => prev + 1);
        }
    }

    function handleFilesChange(e) {
        const nextFiles = Array.from(e.target.files || []);
        if (!nextFiles.length) return;

        const nextGalleryItems = [
            ...galleryItems,
            ...nextFiles.map((file, index) => ({
                kind: "new",
                key: `new:${Date.now()}-${index}-${file.name}`,
                file,
                previewUrl: URL.createObjectURL(file),
            })),
        ];

        setGalleryItems(nextGalleryItems);
        setFileInputKey((prev) => prev + 1);

        if (!coverSelection && nextGalleryItems[0]) {
            setCoverSelection(nextGalleryItems[0].key);
        }
    }

    return (
        <div className="modalOverlay" role="dialog" aria-modal="true">
            <div className="modalCard">
                <h2 className="modalTitle">{title}</h2>

                <div className="modalForm">
                    <label className="modalLabel">Number</label>
                    <input
                        className="modalInput"
                        value={form.numero}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, numero: e.target.value }))
                        }
                    />

                    <label className="modalLabel">Price</label>
                    <input
                        className="modalInput"
                        type="number"
                        step="0.01"
                        value={form.prix}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, prix: e.target.value }))
                        }
                    />

                    <label className="modalLabel">Capacity</label>
                    <input
                        className="modalInput"
                        type="number"
                        value={form.capacite}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, capacite: e.target.value }))
                        }
                    />

                    <label className="modalLabel">Status</label>
                    <div className="modalSelectWrap">
                        <select
                            className="modalInput modalSelect"
                            value={form.statut}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, statut: e.target.value }))
                            }
                        >
                            <option value="active">active</option>
                            <option value="desactivee">desactivee</option>
                        </select>
                    </div>

                    <label className="modalLabel">Room type</label>
                    <div className="modalSelectWrap">
                        <select
                            className="modalInput modalSelect"
                            value={form.id_type}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, id_type: e.target.value }))
                            }
                        >
                            <option value="">Select type</option>
                            {types.map((type) => (
                                <option key={type.id_type} value={type.id_type}>
                                    {type.nom_type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label className="modalLabel">Services</label>
                    <div className="modalServices">
                        {services.map((service) => (
                            <label key={service.id_service} className="modalServiceItem">
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service.id_service)}
                                    onChange={() => toggleService(service.id_service)}
                                />
                                <span>{service.nom_service}</span>
                            </label>
                        ))}
                    </div>

                    <label className="modalLabel">Upload images</label>
                    <label className="modalUpload" htmlFor={`room-photos-${fileInputKey}`}>
                        Choose images
                    </label>
                    <input
                        id={`room-photos-${fileInputKey}`}
                        key={fileInputKey}
                        className="modalFileInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesChange}
                    />
                    {galleryItems.length > 0 && (
                        <div className="modalGallery">
                            {galleryItems.map((item, index) => (
                                <article className="modalGalleryItem" key={item.key}>
                                    <img
                                        className="modalGalleryImg"
                                        src={item.kind === "existing" ? buildMediaUrl(item.url_photo) : item.previewUrl}
                                        alt={`Room photo ${index + 1}`}
                                    />
                                    <button
                                        className={`modalGalleryAction ${coverSelection === item.key ? "is-active" : ""}`}
                                        type="button"
                                        onClick={() => setCoverSelection(item.key)}
                                    >
                                        Cover
                                    </button>
                                    <button
                                        className="modalGalleryDelete"
                                        type="button"
                                        onClick={() => removeGalleryItem(item.key)}
                                    >
                                        {item.kind === "existing" ? "Delete" : "Remove"}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                    {galleryItems.some((item) => item.kind === "new") && (
                        <p className="modalHint">
                            {galleryItems.filter((item) => item.kind === "new").length} image
                            {galleryItems.filter((item) => item.kind === "new").length > 1 ? "s" : ""} selected
                        </p>
                    )}
                </div>

                <div className="modalActions">
                    <button
                        className="modalBtn modalBtn--ghost"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="modalBtn"
                        type="button"
                        onClick={handleSave}
                        disabled={loading || !canSubmit}
                    >
                        {loading ? "Saving..." : isCreate ? "Create" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
