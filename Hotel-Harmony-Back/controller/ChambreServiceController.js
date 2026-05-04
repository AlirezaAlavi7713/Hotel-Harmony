import {
    addServiceToChambre,
    removeServiceFromChambre,
    getServicesByChambre
} from "../model/ChambreServiceModel.js";

// Créer un lien chambre-service
export const addServiceController = async (req, res) => {
    try {
        const { id_chambre, id_service } = req.body;
        console.log(req.body);
        const result = await addServiceToChambre(id_chambre, id_service);
        res.status(201).json({ message: "Service ajouté à la chambre !", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Supprimer un lien chambre-service
export const removeServiceController = async (req, res) => {
    try {
        const { id_chambre, id_service } = req.params;
        const result = await removeServiceFromChambre(id_chambre, id_service);
        res.status(200).json({ message: "Service retiré de la chambre !", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Lister tous les services d'une chambre (GET by chambre ID)
export const getServicesByChambreController = async (req, res) => {
    try {
        const { id_chambre } = req.params;
        const services = await getServicesByChambre(id_chambre);
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};