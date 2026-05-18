import axios from "axios";

const API = import.meta.env.VITE_URL_API;

// Helpers (même style, juste pour éviter de répéter)
const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});

const createClient = (client) => {
  return axios.post(API + "/client", client);
};

const loginClient = (client) => {
  return axios.post(API + "/client/login", client);
};

const getAllClients = () => {
  return axios.get(API + "/clients", authHeader());
};

const getClientById = (id) => {
  return axios.get(API + `/client/${id}`, authHeader());
};

const updateClient = (id, client) => {
  return axios.put(API + `/client/${id}`, client, authHeader());
};

const desactiverClient = (id) => {
  return axios.patch(API + `/client/${id}/desactiver`, null, authHeader());
};

const deleteClient = (id) => {
  return axios.delete(API + `/client/${id}`, authHeader());
};

const getMe = () => {
  return axios.get(API + "/client/me", authHeader());
};

const updateMe = (payload) => {
  return axios.put(API + "/client/me", payload, authHeader());
};

export default {
  createClient,
  loginClient,
  getAllClients,
  getClientById,
  updateClient,
  desactiverClient,
  deleteClient,
  getMe,
  updateMe,
};
