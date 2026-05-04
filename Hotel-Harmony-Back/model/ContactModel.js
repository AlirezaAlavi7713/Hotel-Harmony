import bdd from "../config/bdd.js";

export const createContactMessage = async (nom, email, sujet, message) => {
    const sql = `
    INSERT INTO messages_contact (nom, email, sujet, message)
    VALUES (?, ?, ?, ?);
  `;
    const [result] = await bdd.query(sql, [nom, email, sujet, message]);
    return result;
};

export const getAllContactMessages = async () => {
    const sql = `
    SELECT id_message, nom, email, sujet, message, statut, created_at, reponse, repondu_par, repondu_le
    FROM messages_contact
    ORDER BY created_at DESC;
  `;
    const [rows] = await bdd.query(sql);
    return rows;
};

export const markContactMessageAsRead = async (id_message) => {
    const sql = `
    UPDATE messages_contact
    SET statut = 'lu'
    WHERE id_message = ?;
  `;
    const [result] = await bdd.query(sql, [id_message]);
    return result;
};

export const replyToContactMessage = async (id_message, reponse, repondu_par) => {
    const sql = `
    UPDATE messages_contact
    SET reponse = ?, repondu_par = ?, repondu_le = NOW(), statut = 'repondu'
    WHERE id_message = ?;
  `;
    const [result] = await bdd.query(sql, [reponse, repondu_par, id_message]);
    return result;
};