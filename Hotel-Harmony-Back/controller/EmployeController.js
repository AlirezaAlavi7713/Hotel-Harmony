import {
    createEmploye, updateEmploye, deleteEmploye, getAllEmploye, getEmployeById, getEmployeByEmail
} from "../model/EmployeModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// CREATE
export const createEmployeController = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, role } = req.body;

        // HASH DU MOT DE PASSE
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Crée l’employé avec le mot de passe hashé
        const employe = await createEmploye(nom, prenom, email, hashedPassword, role);

        res.status(201).json({ message: "Employé créé avec mot de passe sécurisé !", employe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// UPDATE
export const updateEmployeController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, mot_de_passe, role } = req.body;

        // Vérifier que l’employé existe
        const employe = await getEmployeById(id);
        if (!employe) {
            return res.status(404).json({ message: "Employé introuvable" });
        }

        // Gestion du mot de passe
        let passwordToSave = employe.mot_de_passe;

        if (mot_de_passe) {
            passwordToSave = await bcrypt.hash(mot_de_passe, 10);
        }

        // Update
        await updateEmploye(
            id, nom, prenom, email, passwordToSave, role
        );
        res.json({ message: "Employé mis à jour avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// DELETE
export const deleteEmployeController = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔒 Protection : empêcher de se supprimer soi-même
        const me = req.user?.id_employe;
        if (Number(id) === Number(me)) {
            return res.status(403).json({ message: "Impossible de se supprimer soi-même." });
        }

        const employe = await getEmployeById(id);
        if (!employe) {
            return res.status(404).json({ message: "Employé introuvable" });
        }

        // 🔒 Protection : empêcher suppression du dernier admin
        if (employe.role === "admin") {
            const admins = await getAllEmploye();
            const adminCount = admins.filter((e) => e.role === "admin").length;

            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Impossible de supprimer le dernier administrateur.",
                });
            }
        }

        await deleteEmploye(id);
        return res.status(200).json({ message: "Employé supprimé !" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur !" });
    }
};

// GET ALL
export const getAllEmployeController = async (req, res) => {
    try {
        const employes = await getAllEmploye();
        res.status(200).json(employes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// GET BY ID
export const getEmployeByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const employe = await getEmployeById(id);
        res.status(200).json(employe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const employe = await getEmployeByEmail(email);
        if (!employe) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const valid = await bcrypt.compare(mot_de_passe, employe.mot_de_passe);
        if (!valid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id_employe: employe.id_employe, role: employe.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            role: employe.role,
            id_employe: employe.id_employe,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};