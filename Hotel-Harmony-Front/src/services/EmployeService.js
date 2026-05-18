import axios from "axios";
const API = import.meta.env.VITE_URL_API;

const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});

const getAllEmployes = () => {
    return axios.get(API + "/employes", authHeader());
};

const getEmployeById = (id) => {
    return axios.get(API + `/employe/${id}`, authHeader());
};

const createEmploye = (payload) => {
    return axios.post(API + "/employe", payload, authHeader());
};

const updateEmploye = (id, payload) => {
    return axios.put(API + `/employe/${id}`, payload, authHeader());
};

const deleteEmploye = (id) => {
    return axios.delete(API + `/employe/${id}`, authHeader());
};

export default {
    getAllEmployes,
    getEmployeById,
    createEmploye,
    updateEmploye,
    deleteEmploye,
};