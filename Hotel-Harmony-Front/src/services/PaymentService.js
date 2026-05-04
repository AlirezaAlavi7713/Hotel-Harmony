import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// 1) initier paiement (retourne paiement + montant)
const initPayment = (id_reservation) => {
  return axios.post(
    API + "/paiements/initier",
    { id_reservation },
    authHeader()
  );
};

export default {
  initPayment,
};
