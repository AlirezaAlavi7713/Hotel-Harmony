import bdd from "../config/bdd.js";

export const createClient = async (nom, prenom, email, telephone, mot_de_passe) => {
    const createClient = `
        INSERT INTO clients (nom, prenom, email, telephone, mot_de_passe)
        VALUES (?,?,?,?,?);
    `;
    const [response] = await bdd.query(createClient, [nom, prenom, email, telephone, mot_de_passe]);
    return response;
};


export const updateClient = async (id_client, nom, prenom, email, telephone) => {

    const updateClient = `
    UPDATE clients
    SET nom = ?, prenom = ?, email = ?, telephone = ?
    WHERE id_client = ?;
    `;
    const [response] = await bdd.query(updateClient,[nom, prenom, email, telephone, id_client])
    return response;
}

export const deleteClient = async (id_client) => {

    const deleteClient = `
    DELETE FROM clients
    WHERE id_client = ?;
    `;
    const [response] = await bdd.query(deleteClient,[id_client])
    return response;
}

export const desactiverClient = async (id_client) => {
    const query = `
        UPDATE clients
        SET statut = 'desactivee'
        WHERE id_client = ?;
    `;
    const [response] = await bdd.query(query, [id_client]);
    return response;
};


export const getAllClient = async () => {
    const query = `
        SELECT id_client, nom, prenom, email, telephone
        FROM clients
        WHERE statut = 'active'
        ORDER BY nom;
    `;
    const [response] = await bdd.query(query);
    return response;
};


export const getClientById = async (id_client) => {

    const clientById = `
    SELECT id_client, nom, prenom, email, telephone, created_at
    FROM clients
    WHERE id_client = ?;
    `;
    const [response] = await bdd.query(clientById, [id_client]);
    return response[0];
}

export const getClientByEmail = async (email) => {
  const sql = "SELECT * FROM clients WHERE email = ? LIMIT 1;";
  const [rows] = await bdd.query(sql, [email]);
  return rows[0];
};