import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const sendMessage = (payload) => {
    return axios.post(API + "/contact", payload);
};

export default { sendMessage };