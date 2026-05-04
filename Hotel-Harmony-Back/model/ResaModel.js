import bdd from "../config/bdd.js";

// Créer une réservation
export const createReservation = async (id_client, id_chambre, date_debut, date_fin) => {
  const statut = "en_attente"; // future paiment : en_attente -> confirmée
  const sql = `
        INSERT INTO reservations (id_client, id_chambre, date_debut, date_fin, statut)
        VALUES (?, ?, ?, ?, ?);
    `;
  const [response] = await bdd.query(sql, [id_client, id_chambre, date_debut, date_fin, statut]);
  return response;
};

// Mettre à jour une réservation
export const updateReservation = async (id, id_client, id_chambre, date_debut, date_fin, statut) => {
  const sql = `
        UPDATE reservations
        SET id_client = ?, id_chambre = ?, date_debut = ?, date_fin = ?, statut = ?
        WHERE id_reservation = ?;
    `;
  const [response] = await bdd.query(sql, [id_client, id_chambre, date_debut, date_fin, statut, id]);
  return response;
};

// Supprimer une réservation
export const deleteReservation = async (id) => {
  const sql = `
        DELETE FROM reservations
        WHERE id_reservation = ?;
    `;
  const [response] = await bdd.query(sql, [id]);
  return response;
};

// Récupérer toutes les réservations
export const getAllReservations = async () => {
  const sql = `
        SELECT r.id_reservation, r.date_debut, r.date_fin, r.statut,
               c.nom AS client_nom, c.prenom AS client_prenom,
               ch.numero AS chambre_numero
        FROM reservations r
        JOIN clients c ON r.id_client = c.id_client
        JOIN chambres ch ON r.id_chambre = ch.id_chambre
        ORDER BY r.date_debut;
    `;
  const [response] = await bdd.query(sql);
  return response;
};

// Récupérer une réservation par ID
export const getReservationById = async (id) => {
  const sql = `
    SELECT r.id_reservation, r.id_client, r.id_chambre, r.date_debut, r.date_fin, r.statut,
           c.nom AS client_nom, c.prenom AS client_prenom,
           ch.numero AS chambre_numero,
           ch.prix AS prix_nuit
    FROM reservations r
    JOIN clients c ON r.id_client = c.id_client
    JOIN chambres ch ON r.id_chambre = ch.id_chambre
    WHERE r.id_reservation = ?;
  `;
  const [rows] = await bdd.query(sql, [id]);
  return rows[0];
};

// Récupérer uniquement les réservations du client connecté
export const getMyReservations = async (id_client) => {
  const sql = `
    SELECT 
      r.id_reservation,
      r.id_chambre,
      r.date_debut,
      r.date_fin,
      r.statut,
      ch.numero AS chambre_numero,
      ch.prix AS prix_nuit
    FROM reservations r
    JOIN chambres ch ON r.id_chambre = ch.id_chambre
    WHERE r.id_client = ?
    ORDER BY r.date_debut DESC;
  `;
  const [rows] = await bdd.query(sql, [id_client]);
  return rows;
};

// Récupérer infos nécessaires au calcul du prix (prix_base/nuit + dates + statut + propriétaire)
export const getReservationForPricing = async (id_reservation) => {
  const sql = `
    SELECT
      r.id_reservation,
      r.id_client,
      r.date_debut,
      r.date_fin,
      r.statut,
      ch.prix AS prix_nuit
    FROM reservations r
    JOIN chambres ch ON ch.id_chambre = r.id_chambre
    WHERE r.id_reservation = ?
    LIMIT 1;
  `;
  const [rows] = await bdd.query(sql, [id_reservation]);
  return rows[0];
};


export const cancelReservation = async (id_reservation) => {
  const sql = "UPDATE reservations SET statut = 'annulee' WHERE id_reservation = ?;";
  const [result] = await bdd.query(sql, [id_reservation]);
  return result;
};

// Vérifie si une chambre est déjà réservée sur une période donnée
export const hasReservationConflict = async (id_chambre, date_debut, date_fin) => {
  const sql = `
    SELECT COUNT(*) AS nb
    FROM reservations
    WHERE id_chambre = ?
      AND statut != 'annulee'
      AND (date_debut < ? AND date_fin > ?);
  `;
  // chevauchement si : date_debut_existante < date_fin_nouvelle ET date_fin_existante > date_debut_nouvelle
  const [rows] = await bdd.query(sql, [id_chambre, date_fin, date_debut]);
  return rows[0].nb > 0;
};


export const confirmReservation = async (id_reservation) => {
  const sql = `UPDATE reservations SET statut = 'confirmee' WHERE id_reservation = ?`;
  const [result] = await bdd.query(sql, [id_reservation]);
  return result;
};
