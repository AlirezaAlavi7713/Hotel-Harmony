import {
    createPhoto,
    updatePhoto,
    deletePhoto,
    getAllPhotos,
    getPhotoById,
    getCoverPhotoByRoomId,
    getPhotosByRoomId,
    replacePhotosByRoomId
} from "../model/PhotoChambreModel.js";
import cloudinary from "../config/cloudinary.js";

// Ajouter une photo
export const createPhotoController = async (req, res) => {
    try {
        const { url_photo, id_chambre } = req.body;
        const photo = await createPhoto(url_photo, id_chambre);
        res.status(201).json({ message: "Photo ajoutée !", photo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Mettre à jour une photo
export const updatePhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { url_photo } = req.body;
        const updated = await updatePhoto(id, url_photo);
        res.status(200).json({ message: "Photo modifiée !", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Supprimer une photo
export const deletePhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deletePhoto(id);
        res.status(200).json({ message: "Photo supprimée !", deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Récupérer toutes les photos
export const getAllPhotosController = async (req, res) => {
    try {
        const photos = await getAllPhotos();
        res.status(200).json(photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

// Récupérer une photo par ID
export const getPhotoByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const photo = await getPhotoById(id);
        res.status(200).json(photo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur !" });
    }
};

export const getCoverPhotoController = async (req, res) => {
  try {
    const { id_chambre } = req.params;

    const photo = await getCoverPhotoByRoomId(id_chambre);

    // Si pas de photo, on renvoie null (le front mettra un placeholder)
    return res.status(200).json({
      url_photo: photo?.url_photo || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getRoomPhotosController = async (req, res) => {
  try {
    const { id_chambre } = req.params;
    const photos = await getPhotosByRoomId(id_chambre);
    return res.status(200).json(photos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const replaceRoomPhotosController = async (req, res) => {
  try {
    const { id_chambre } = req.params;
    const { photos } = req.body;

    if (!Array.isArray(photos)) {
      return res.status(400).json({ message: "Le champ photos doit etre un tableau" });
    }

    await replacePhotosByRoomId(Number(id_chambre), photos);

    const updatedPhotos = await getPhotosByRoomId(Number(id_chambre));

    return res.status(200).json({
      message: "Photos mises a jour !",
      photos: updatedPhotos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const uploadRoomPhotosController = async (req, res) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];

    const photos = await Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "hotel-harmony" },
            (error, result) => {
              if (error) return reject(error);
              resolve({ filename: result.public_id, url_photo: result.secure_url });
            }
          );
          stream.end(file.buffer);
        })
      )
    );

    return res.status(201).json({ message: "Photos uploadées !", photos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
