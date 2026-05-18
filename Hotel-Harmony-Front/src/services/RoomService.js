import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});

/* ===== PUBLIC ===== */
const getAllRooms = () => {
  return axios.get(API + "/chambres");
};

const getRoomById = (id) => {
  return axios.get(API + `/chambre/${id}`);
};

const getAvailableRooms = ({ date_debut, date_fin, personnes }) => {
  return axios.get(API + "/chambres/disponibles", {
    params: { date_debut, date_fin, personnes },
  });
};

/* ===== STAFF ===== */
const createRoom = (payload) => {
  return axios.post(API + "/chambre", payload, authHeader());
};

const getAllRoomsStaff = () => {
  return axios.get(API + "/staff/chambres", authHeader());
};

const setRoomStatut = (id, statut) => {
  return axios.patch(API + `/chambre/${id}/statut`, { statut }, authHeader());
};

const updateRoom = (id, payload) => {
  return axios.put(API + `/chambre/${id}`, payload, authHeader());
};

const getAllServices = () => {
  return axios.get(API + "/services");
};

/* ===== TYPES ===== */
const getAllRoomTypes = () => {
  return axios.get(API + "/type_chambres");
};

export default {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  getAllRoomsStaff,
  setRoomStatut,
  updateRoom,
  getAllServices,
  getAllRoomTypes,
};
