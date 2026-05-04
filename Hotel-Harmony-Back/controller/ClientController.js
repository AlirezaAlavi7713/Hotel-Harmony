import { createClient, getAllClient, getClientById, updateClient, deleteClient, desactiverClient, getClientByEmail } from "../model/ClientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const SECRET_KEY = process.env.JWT_SECRET;


export const createClientController = async (req, res) => {
    try {
        const { nom, prenom, email, telephone, mot_de_passe } = req.body;
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const client = await createClient(nom, prenom, email, telephone, hashedPassword);
        res.status(201).json({ message: "client créé !", client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur serveur !" });
    }
};


export const updateClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, telephone } = req.body;
        const updatedClient = await updateClient(id, nom, prenom, email, telephone);
        res.status(200).json({ message: "client modifié !", updatedClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur serveur !" });
    }
};

export const deleteClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClient = await deleteClient(id);
        res.status(200).json({ message: "client supprimé !", deletedClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur serveur !" });
    }
};

export const desactiverClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await desactiverClient(id);
        res.status(200).json({ message: "Client désactivé !", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};


export const getAllClientController = async (req, res) => {
    try {
        const clients = await getAllClient();
        res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur serveur !" });
    }
};

export const getClientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getClientById(id);
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "erreur serveur !" });
    }
};

export const loginClientController = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const client = await getClientByEmail(email);
        if (!client) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        if (!client.mot_de_passe) {
            return res.status(401).json({ message: "Compte non initialisé (mot de passe manquant)" });
        }

        const valid = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
        if (!valid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: client.id_client, role: "client", type: "client" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        
        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getMeClientController = async (req, res) => {
    try {
        const id_client = req.user?.id ?? req.user?.id_client;
        if (!id_client) return res.status(401).json({ message: "Token invalide" });

        const client = await getClientById(id_client);
        if (!client) return res.status(404).json({ message: "Client introuvable" });

        return res.json(client);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateMeClientController = async (req, res) => {
    try {
        const id_client = req.user?.id ?? req.user?.id_client;
        if (!id_client) return res.status(401).json({ message: "Token invalide" });

        const nom = String(req.body.nom || "").trim();
        const prenom = String(req.body.prenom || "").trim();
        const email = String(req.body.email || "").trim();
        const telephone = String(req.body.telephone || "").trim();

        if (!nom || !prenom || !email) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        await updateClient(id_client, nom, prenom, email, telephone);
        return res.json({ message: "Profil mis à jour ✅" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};