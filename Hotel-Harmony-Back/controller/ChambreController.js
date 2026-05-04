import {
    createChambre,
    getAllChambre,
    getAvailableChambres,
    getAllChambreStaff,
    getChambreById,
    updateChambre,
    deleteChambre,
    setChambreStatut,
    setChambreServices,
} from "../model/ChambreModel.js";

/* =======================
   CREATE (STAFF)
======================= */
export const createChambreController = async (req, res) => {
    try {
        const { numero, prix, capacite, statut, id_type, services } = req.body;

        if (!numero || !prix || !capacite || !id_type) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        const result = await createChambre(
            numero,
            Number(prix),
            Number(capacite),
            Number(id_type),
            statut || "active"
        );

        await setChambreServices(result.insertId, services || []);

        return res.status(201).json({ message: "Chambre créée ✅", chambre: result,});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   UPDATE (STAFF)
======================= */
export const updateChambreController = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero, prix, capacite, statut, id_type, services } = req.body;

        if (!numero || !prix || !capacite || !statut || !id_type) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        const result = await updateChambre(
            Number(id),
            numero,
            Number(prix),
            Number(capacite),
            statut,
            Number(id_type)
        );

        if (Array.isArray(services)) {
            await setChambreServices(Number(id), services);
        }

        return res.status(200).json({ message: "Chambre modifiée ✅", result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   DELETE (ADMIN)
======================= */
export const deleteChambreController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteChambre(Number(id));
        return res.status(200).json({ message: "Chambre supprimée ✅", result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   PUBLIC GET ALL (active only)
======================= */
export const getAllChambreController = async (req, res) => {
    try {
        const rows = await getAllChambre();
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const getAvailableChambresController = async (req, res) => {
    try {
        const date_debut = String(req.query.date_debut || "").trim();
        const date_fin = String(req.query.date_fin || "").trim();
        const personnes = Number(req.query.personnes || 1);

        if (!date_debut || !date_fin) {
            return res.status(400).json({ message: "date_debut et date_fin sont requis" });
        }

        if (Number.isNaN(personnes) || personnes < 1) {
            return res.status(400).json({ message: "Nombre de personnes invalide" });
        }

        const start = new Date(date_debut);
        const end = new Date(date_fin);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return res.status(400).json({ message: "Dates invalides" });
        }

        if (start < today) {
            return res.status(400).json({ message: "La date de début ne peut pas être dans le passé" });
        }

        // On bloque les séjours incohérents avant d'interroger la BDD.
        if (end <= start) {
            return res.status(400).json({ message: "La date de fin doit être après la date de début" });
        }

        const rows = await getAvailableChambres(date_debut, date_fin, personnes);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   STAFF GET ALL (active + desactivee)
======================= */
export const getAllChambreStaffController = async (req, res) => {
    try {
        const rows = await getAllChambreStaff();
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   GET BY ID (public)
======================= */
export const getChambreByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await getChambreById(Number(id));

        if (!room) {
            return res.status(404).json({ message: "Chambre introuvable" });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

/* =======================
   STAFF PATCH STATUT (toggle active/desactivee)
======================= */
export const setChambreStatutController = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (statut !== "active" && statut !== "desactivee") {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const result = await setChambreStatut(Number(id), statut);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Chambre introuvable" });
        }

        return res.status(200).json({ message: "Statut mis à jour ✅", result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};
