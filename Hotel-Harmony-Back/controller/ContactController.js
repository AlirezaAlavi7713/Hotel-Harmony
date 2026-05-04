import {
    createContactMessage,
    getAllContactMessages,
    markContactMessageAsRead,
    replyToContactMessage
} from "../model/ContactModel.js";

export const createContactMessageController = async (req, res) => {
    try {
        const nom = String(req.body.nom || "").trim();
        const email = String(req.body.email || "").trim();
        const sujet = String(req.body.sujet || "").trim();
        const message = String(req.body.message || "").trim();

        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) return res.status(400).json({ message: "Email invalide" });
        if (nom.length < 2) return res.status(400).json({ message: "Nom trop court" });
        if (sujet.length < 3) return res.status(400).json({ message: "Sujet trop court" });
        if (message.length < 10) return res.status(400).json({ message: "Message trop court" });
        if (message.length > 2000) return res.status(400).json({ message: "Message trop long" });

        await createContactMessage(nom, email, sujet, message);
        return res.status(201).json({ message: "Message envoyé ✅" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ STAFF: liste
export const getAllContactMessagesController = async (req, res) => {
    try {
        const rows = await getAllContactMessages();
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ STAFF: marquer lu
export const markContactMessageAsReadController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await markContactMessageAsRead(Number(id));

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Message introuvable" });
        }

        return res.json({ message: "Message marqué comme lu ✅" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const replyToContactMessageController = async (req, res) => {
    try {
        const { id } = req.params;
        const reponse = String(req.body.reponse || "").trim();

        const id_employe = req.user?.id_employe;
        if (!id_employe) {
            return res.status(401).json({ message: "Employé non identifié" });
        }

        const result = await replyToContactMessage(Number(id), reponse, id_employe);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Message introuvable" });
        }

        return res.json({ message: "Réponse enregistrée ✅" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
