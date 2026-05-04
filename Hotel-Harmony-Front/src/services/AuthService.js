import axios from "axios";
const API = import.meta.env.VITE_URL_API;

const login = async ({ email, mot_de_passe }) => {
  // 1) essayer staff
  try {
    const staffRes = await axios.post(API + "/employes/login", { email, mot_de_passe });
    return { ...staffRes.data, type: "staff" }; // { token, role, id_employe, type }
  } catch (err) {
    // si c’est 401 => pas staff, on tente client
    if (err?.response?.status !== 401) throw err;
  }

  // 2) essayer client
  const clientRes = await axios.post(API + "/client/login", { email, mot_de_passe });
  return { ...clientRes.data, type: "client" }; // { token, type }
};

export default { login };