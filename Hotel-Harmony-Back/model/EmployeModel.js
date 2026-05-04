import bdd from "../config/bdd.js";

// CREATE
export const createEmploye = async (nom, prenom, email, mot_de_passe, role) => {
  const sql = `
    INSERT INTO employes (nom, prenom, email, mot_de_passe, role)
    VALUES (?, ?, ?, ?, ?);
  `;
  const [response] = await bdd.query(sql, [nom, prenom, email, mot_de_passe, role]);
  return response;
};


// UPDATE
export const updateEmploye = async (id_employe, nom, prenom, email, mot_de_passe, role) => {
    const sql = `
        UPDATE employes
        SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, role = ?
        WHERE id_employe = ?;
    `;
    const [response] = await bdd.query(sql, [nom, prenom, email, mot_de_passe, role, id_employe]);
    return response;
};

// DELETE
export const deleteEmploye = async (id_employe) => {
    const sql = `DELETE FROM employes WHERE id_employe = ?;`;
    const [response] = await bdd.query(sql, [id_employe]);
    return response;
};

// GET ALL
export const getAllEmploye = async () => {
    const sql = `SELECT * FROM employes ORDER BY nom;`;
    const [response] = await bdd.query(sql);
    return response;
};

// GET BY ID
export const getEmployeById = async (id_employe) => {
    const sql = `SELECT * FROM employes WHERE id_employe = ?;`;
    const [response] = await bdd.query(sql, [id_employe]);
    return response[0]; // retourne un seul employé
};

export const getEmployeByEmail = async (email) => {
    const query = "SELECT * FROM employes WHERE email = ?";
    const [result] = await bdd.query(query, [email]);
    return result[0]; // retourne un seul employé
};