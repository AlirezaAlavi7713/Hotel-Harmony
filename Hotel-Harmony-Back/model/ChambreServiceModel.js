import bdd from "../config/bdd.js";

// Ajouter un service à une chambre
export const addServiceToChambre = async (id_chambre, id_service) => {
    const sql = `
        INSERT INTO chambre_service (id_chambre, id_service)
        VALUES (?, ?);
    `;
    const [response] = await bdd.query(sql, [id_chambre, id_service]);
    return response;
};

// Supprimer un service d'une chambre
export const removeServiceFromChambre = async (id_chambre, id_service) => {
    const sql = `
        DELETE FROM chambre_service
        WHERE id_chambre = ? AND id_service = ?;
    `;
    const [response] = await bdd.query(sql, [id_chambre, id_service]);
    return response;
};

// Lister tous les services d'une chambre
export const getServicesByChambre = async (id_chambre) => {
    const sql = `
        SELECT cs.id_chambre, s.id_service, s.nom_service
        FROM chambre_service cs
        JOIN services s ON cs.id_service = s.id_service
        WHERE cs.id_chambre = ?;
    `;
    const [response] = await bdd.query(sql, [id_chambre]);
    return response;
};
