import {
    createReservation,
    getAllReservations,
    getReservationById,
    getMyReservations,
    updateReservation,
    deleteReservation,
    hasReservationConflict,
    cancelReservation,
    getReservationForPricing,
    confirmReservation
} from "../model/ResaModel.js";
import { createPaiement, getPaiementByReservation, updatePaiementStatus } from "../model/PaiementModel.js";

export const createReservationController = async (req, res) => {
    try {
        let id_client;

        // si CLIENT → il réserve pour lui-même
        if (req.user.role === "client") {
            id_client = req.user.id ?? req.user.id_client;
        }

        // si EMPLOYÉ ou ADMIN → il réserve pour quelqu’un
        else if (req.user.role === "employe" || req.user.role === "admin") {
            id_client = req.body.id_client;
        }

        if (!id_client) {
            return res.status(400).json({ message: "id_client requis" });
        }

        // Récupérer les champs réservation
        const { id_chambre, date_debut, date_fin } = req.body;

        // mini validation
        if (!id_client || !id_chambre || !date_debut || !date_fin) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        // contrôle conflit
        const conflict = await hasReservationConflict(id_chambre, date_debut, date_fin);
        if (conflict) {
            return res.status(409).json({ message: "Chambre déjà réservée sur cette période" });
        }

        const reservation = await createReservation(id_client, id_chambre, date_debut, date_fin);
        return res.status(201).json({
            message: "Réservation créée !", id_reservation: reservation.insertId, reservation: {
                id_client,
                id_chambre,
                date_debut,
                date_fin,
                statut: "en_attente"
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};


// UPDATE
export const updateReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_client, id_chambre, date_debut, date_fin, statut } = req.body;
        const updated = await updateReservation(id, id_client, id_chambre, date_debut, date_fin, statut);
        res.status(200).json({ message: "Réservation modifiée !", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// DELETE
export const deleteReservationController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteReservation(id);
        res.status(200).json({ message: "Réservation supprimée !", deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// READ ALL
export const getAllReservationsController = async (req, res) => {
    try {
        const reservations = await getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// READ BY ID
export const getReservationByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await getReservationById(id);
        if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

        // Si client -> doit être propriétaire
        if (req.user?.role === "client") {
            const id_client = req.user.id ?? req.user.id_client;
            if (reservation.id_client !== id_client) {
                return res.status(403).json({ message: "Accès refusé" });
            }
        }

        return res.status(200).json(reservation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const getMyReservationsController = async (req, res) => {
    try {
        const id_client = req.user.id ?? req.user.id_client;

        if (!id_client) {
            return res.status(401).json({ message: "Token invalide (id manquant)" });
        }

        const reservations = await getMyReservations(id_client);
        return res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};


export const cancelReservationController = async (req, res) => {
    try {
        const { id } = req.params; // id_reservation
        const role = req.user?.role;

        const resa = await getReservationById(id);
        if (!resa) return res.status(404).json({ message: "Réservation introuvable" });

        // déjà annulée ?
        if (resa.statut === "annulee") {
            return res.status(409).json({ message: "Réservation déjà annulée" });
        }

        // Si client -> doit être propriétaire
        if (role === "client") {
            const id_client = req.user.id ?? req.user.id_client;

            if (resa.id_client !== id_client) {
                return res.status(403).json({ message: "Accès refusé" });
            }
        }

        // Si employe/admin -> autorisé à annuler n'importe quelle réservation
        const result = await cancelReservation(id);
        return res.json({ message: "Réservation annulée ✅", result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const confirmReservationByStaffController = async (req, res) => {
    try {
        const { id } = req.params;

        const resa = await getReservationForPricing(id);
        if (!resa) return res.status(404).json({ message: "Réservation introuvable" });

        if (resa.statut === "annulee") {
            return res.status(409).json({ message: "Une réservation annulée ne peut pas être finalisée" });
        }

        if (resa.statut === "confirmee") {
            return res.status(409).json({ message: "Réservation déjà confirmée" });
        }

        const start = new Date(resa.date_debut);
        const end = new Date(resa.date_fin);
        const diffMs = end - start;
        const nbNuits = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (nbNuits <= 0) {
            return res.status(400).json({ message: "Dates invalides" });
        }

        const montant = Number((Number(resa.prix_nuit) * nbNuits).toFixed(2));
        const paiement = await getPaiementByReservation(id);

        if (paiement) {
            if (paiement.statut !== "reussi") {
                await updatePaiementStatus(paiement.id_paiement, "reussi");
            }
        } else {
            const created = await createPaiement(id, resa.id_client, montant);
            await updatePaiementStatus(created.insertId, "reussi");
        }

        await confirmReservation(id);

        return res.json({ message: "Réservation finalisée ✅" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
