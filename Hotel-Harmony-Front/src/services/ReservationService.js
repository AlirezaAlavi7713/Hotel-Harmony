import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ================= CLIENT ================= */

// Voir ses réservations
const getMyReservations = () => {
  return axios.get(API + "/reservations/me", authHeader());
};

// Annuler sa réservation
const cancelReservation = (id) => {
  return axios.patch(API + `/reservation/${id}/annuler`, null, authHeader());
};

const confirmReservationByStaff = (id) => {
  return axios.patch(API + `/reservation/${id}/confirmer`, null, authHeader());
};


/* ================= EMPLOYE / ADMIN ================= */

// Voir toutes les réservations
const getAllReservations = () => {
  return axios.get(API + "/reservations", authHeader());
};

// Voir une réservation
const getReservationById = (id) => {
  return axios.get(API + `/reservation/${id}`, authHeader());
};

// Supprimer réservation (admin)
const deleteReservation = (id) => {
  return axios.delete(API + `/reservation/${id}`, authHeader());
};


/* ================= CREATE / UPDATE ================= */

// Créer réservation (client ou employé)
const createReservation = (payload) => {
  // payload: { id_chambre, date_debut, date_fin, id_client? }
  return axios.post(API + "/reservation", payload, authHeader());
};

// Modifier réservation
const updateReservation = (id, payload) => {
  return axios.put(API + `/reservation/${id}`, payload, authHeader());
};

export default {
  getMyReservations,
  cancelReservation,
  confirmReservationByStaff,
  getAllReservations,
  getReservationById,
  deleteReservation,
  createReservation,
  updateReservation,
};
