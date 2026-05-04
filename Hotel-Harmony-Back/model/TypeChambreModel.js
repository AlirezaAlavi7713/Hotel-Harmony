import bdd from "../config/bdd.js";

// CREATE
export const createTypeChambre = async (nom_type, prix_base) => {
    const sql = `
        INSERT INTO type_chambre (nom_type, prix_base)
        VALUES (?, ?);
    `;
    const [response] = await bdd.query(sql, [nom_type, prix_base]);
    return response;
};

// UPDATE
export const updateTypeChambre = async (id_type, nom_type, prix_base) => {
    const sql = `
        UPDATE type_chambre
        SET nom_type = ?, prix_base = ?
        WHERE id_type = ?;
    `;
    const [response] = await bdd.query(sql, [nom_type, prix_base, id_type]);
    return response;
};

// DELETE
export const deleteTypeChambre = async (id_type) => {
    const sql = `
        DELETE FROM type_chambre
        WHERE id_type = ?;
    `;
    const [response] = await bdd.query(sql, [id_type]);
    return response;
};

// GET ALL
export const getAllTypeChambre = async () => {
    const sql = `
        SELECT * FROM type_chambre
        ORDER BY id_type;
    `;
    const [response] = await bdd.query(sql);
    return response;
};

// GET BY ID
export const getTypeChambreById = async (id_type) => {
    const sql = `
        SELECT * FROM type_chambre
        WHERE id_type = ?;
    `;
    const [response] = await bdd.query(sql, [id_type]);
    return response[0];
};
