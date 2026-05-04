import bdd from "../config/bdd.js";

// Ajouter une photo à une chambre
export const createPhoto = async (url_photo, id_chambre) => {
    const query = `
        INSERT INTO photos_chambre (url_photo, id_chambre)
        VALUES (?, ?);
    `;
    const [response] = await bdd.query(query, [url_photo, id_chambre]);
    return response;
};

// Mettre à jour une photo
export const updatePhoto = async (id_photo, url_photo) => {
    const query = `
        UPDATE photos_chambre
        SET url_photo = ?
        WHERE id_photo = ?;
    `;
    const [response] = await bdd.query(query, [url_photo, id_photo]);
    return response;
};

// Supprimer une photo
export const deletePhoto = async (id_photo) => {
    const query = `
        DELETE FROM photos_chambre
        WHERE id_photo = ?;
    `;
    const [response] = await bdd.query(query, [id_photo]);
    return response;
};

// Récupérer toutes les photos
export const getAllPhotos = async () => {
    const query = `
        SELECT p.id_photo, p.url_photo, p.id_chambre, c.numero AS numero_chambre
        FROM photos_chambre p
        JOIN chambres c ON p.id_chambre = c.id_chambre;
    `;
    const [response] = await bdd.query(query);
    return response;
};

// Récupérer une photo par son ID
export const getPhotoById = async (id_photo) => {
    const query = `
        SELECT p.id_photo, p.url_photo, p.id_chambre, c.numero AS numero_chambre
        FROM photos_chambre p
        JOIN chambres c ON p.id_chambre = c.id_chambre
        WHERE p.id_photo = ?;
    `;
    const [response] = await bdd.query(query, [id_photo]);
    return response[0];
};

export const getCoverPhotoByRoomId = async (id_chambre) => {
  const sql = `
    SELECT url_photo
    FROM photos_chambre
    WHERE id_chambre = ?
    ORDER BY id_photo ASC
    LIMIT 1;
  `;
  const [rows] = await bdd.query(sql, [id_chambre]);
  return rows[0]; // { url_photo } ou undefined
};

export const getPhotosByRoomId = async (id_chambre) => {
  const sql = `
    SELECT id_photo, url_photo, id_chambre
    FROM photos_chambre
    WHERE id_chambre = ?
    ORDER BY id_photo ASC;
  `;
  const [rows] = await bdd.query(sql, [id_chambre]);
  return rows;
};

export const replacePhotosByRoomId = async (id_chambre, photos = []) => {
  await bdd.query(
    "DELETE FROM photos_chambre WHERE id_chambre = ?",
    [id_chambre]
  );

  const cleanPhotos = photos
    .map((photo) => String(photo || "").trim())
    .filter(Boolean);

  if (!cleanPhotos.length) return;

  const values = cleanPhotos.map((url_photo) => [url_photo, id_chambre]);

  await bdd.query(
    "INSERT INTO photos_chambre (url_photo, id_chambre) VALUES ?",
    [values]
  );
};
