import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const getMessages = () => {
    return axios.get(API + "/contact/messages", authHeader());
};

const markAsRead = (id) => {
    return axios.patch(API + `/contact/messages/${id}/lu`, null, authHeader());
};

const reply = (id, reponse) => {
    return axios.patch(API + `/contact/messages/${id}/repondre`, { reponse }, authHeader());
};


export default {
    getMessages,
    markAsRead,
    reply,
};