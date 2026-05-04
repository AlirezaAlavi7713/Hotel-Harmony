import bdd from "../config/bdd.js";

export const createPaiement = async (id_reservation, id_client, montant) => {
  const sql = `
    INSERT INTO paiements (id_reservation, id_client, montant, statut)
    VALUES (?, ?, ?, 'en_attente');
  `;
  const [result] = await bdd.query(sql, [id_reservation, id_client, montant]);
  return result;
};

export const attachStripeSessionToPaiement = async (
  id_paiement,
  stripe_session_id,
  stripe_payment_intent_id = null
) => {
  const sql = `
    UPDATE paiements
    SET stripe_session_id = ?, stripe_payment_intent_id = ?
    WHERE id_paiement = ?;
  `;
  const [result] = await bdd.query(sql, [
    stripe_session_id,
    stripe_payment_intent_id,
    id_paiement,
  ]);
  return result;
};

export const getPaiementByReservation = async (id_reservation) => {
  const sql = `
    SELECT * FROM paiements
    WHERE id_reservation = ?
    ORDER BY id_paiement DESC
    LIMIT 1;
  `;
  const [rows] = await bdd.query(sql, [id_reservation]);
  return rows[0];
};

export const getPaiementByStripeSessionId = async (stripe_session_id) => {
  const sql = `
    SELECT * FROM paiements
    WHERE stripe_session_id = ?
    LIMIT 1;
  `;
  const [rows] = await bdd.query(sql, [stripe_session_id]);
  return rows[0];
};

export const updatePaiementStatus = async (id_paiement, statut) => {
  const sql = `UPDATE paiements SET statut = ? WHERE id_paiement = ?`;
  const [result] = await bdd.query(sql, [statut, id_paiement]);
  return result;
};
