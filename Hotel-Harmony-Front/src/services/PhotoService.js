import axios from "axios";

const API = import.meta.env.VITE_URL_API;

const getRoomCoverPhoto = (id_chambre) => {
  return axios.get(API + `/chambres/${id_chambre}/photos/cover`);
};

const getRoomPhotos = (id_chambre) => {
  return axios.get(API + `/chambres/${id_chambre}/photos`);
};

const replaceRoomPhotos = (id_chambre, photos) => {
  return axios.put(
    API + `/chambres/${id_chambre}/photos`,
    { photos },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
};

const uploadRoomPhotos = (id_chambre, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("photos", file);
  });

  return axios.post(
    API + `/chambres/${id_chambre}/photos/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export default {
  getRoomCoverPhoto,
  getRoomPhotos,
  replaceRoomPhotos,
  uploadRoomPhotos,
};
