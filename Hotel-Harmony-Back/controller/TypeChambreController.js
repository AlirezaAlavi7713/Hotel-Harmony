import {
    createTypeChambre,
    updateTypeChambre,
    deleteTypeChambre,
    getAllTypeChambre,
    getTypeChambreById
} from "../model/TypeChambreModel.js";

// CREATE
export const createTypeChambreController = async (req, res) => {
    try {
        const { nom_type, prix_base } = req.body;
        const type = await createTypeChambre(nom_type, prix_base);
        res.status(201).json({ message: "Type de chambre créé !", type });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// UPDATE
export const updateTypeChambreController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_type, prix_base } = req.body;
        const updated = await updateTypeChambre(id, nom_type, prix_base);
        res.status(200).json({ message: "Type de chambre modifié !", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// DELETE
export const deleteTypeChambreController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteTypeChambre(id);
        res.status(200).json({ message: "Type de chambre supprimé !", deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// GET ALL
export const getAllTypeChambreController = async (req, res) => {
    try {
        const all = await getAllTypeChambre();
        res.status(200).json(all);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// GET BY ID
export const getTypeChambreByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await getTypeChambreById(id);
        res.status(200).json(type);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};
