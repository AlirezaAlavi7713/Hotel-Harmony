import { 
    createService, 
    updateService, 
    deleteService,
    desactiverService,
    getAllService, 
    getServiceById
} from "../model/ServiceModel.js";

// CREATE
export const createServiceController = async (req, res) => {
    try {
        const { nom_service } = req.body;
        const service = await createService(nom_service);
        res.status(201).json({ message: "Service créé !", service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// UPDATE
export const updateServiceController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_service } = req.body;
        const updatedService = await updateService(id, nom_service);
        res.status(200).json({ message: "Service modifié !", updatedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// DELETE
export const deleteServiceController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await deleteService(id);
        res.status(200).json({ message: "Service supprimé !", deletedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const desactiverServiceController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await desactiverService(id);
        res.status(200).json({ message: "Service désactivé !", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const getAllServiceController = async (req, res) => {
    try {
        const services = await getAllService();
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// GET BY ID
export const getServiceByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await getServiceById(id);
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

