import bdd from "../config/bdd.js";

// CREATE
export const createService = async (nom_service) => {
    const query = `
        INSERT INTO services (nom_service)
        VALUES (?);
    `;
    const [response] = await bdd.query(query, [nom_service]);
    return response;
};

// UPDATE
export const updateService = async (id_service, nom_service) => {
    const query = `
        UPDATE services
        SET nom_service = ?
        WHERE id_service = ?;
    `;
    const [response] = await bdd.query(query, [nom_service, id_service]);
    return response;
};

// DELETE
export const deleteService = async (id_service) => {
    const query = "DELETE FROM services WHERE id_service = ?;";
    const [response] = await bdd.query(query, [id_service]);
    return response;
};

export const desactiverService = async (id_service) => {
    const query = `
        UPDATE services
        SET statut = 'desactivee'
        WHERE id_service = ?;
    `;
    const [response] = await bdd.query(query, [id_service]);
    return response;
};

/// GET services actifs uniquement
export const getAllService = async () => {
    const query = `
        SELECT id_service, nom_service
        FROM services
        WHERE statut = 'active'
        ORDER BY nom_service;
    `;
    const [response] = await bdd.query(query);
    return response;
};

// GET BY ID
export const getServiceById = async (id_service) => {
    const query = "SELECT * FROM services WHERE id_service = ?;";
    const [response] = await bdd.query(query, [id_service]);
    return response[0];
};

