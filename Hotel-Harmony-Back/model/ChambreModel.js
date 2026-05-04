import bdd from "../config/bdd.js";

/* ✅ CREATE : ordre clean */
export const createChambre = async (numero, prix, capacite, id_type, statut = "active") => {
  const sql = `
    INSERT INTO chambres (numero, prix, capacite, statut, id_type)
    VALUES (?,?,?,?,?);
  `;
  const [response] = await bdd.query(sql, [numero, prix, capacite, statut, id_type]);
  return response;
};

export const updateChambre = async (id_chambre, numero, prix, capacite, statut, id_type) => {
  const sql = `
    UPDATE chambres
    SET numero = ?, prix = ?, capacite = ?, statut = ?, id_type = ?
    WHERE id_chambre = ?; 
  `;
  const [response] = await bdd.query(sql, [numero, prix, capacite, statut, id_type, id_chambre]);
  return response;
};

export const deleteChambre = async (id_chambre) => {
  const sql = `
    DELETE FROM chambres
    WHERE id_chambre = ?;
  `;
  const [response] = await bdd.query(sql, [id_chambre]);
  return response;
};

/* PUBLIC: seulement active */
export const getAllChambre = async () => {
  const allChambre = `
    SELECT 
      c.id_chambre,
      c.numero,
      c.prix,
      c.capacite,
      c.statut,
      t.nom_type AS type_chambre,
      (
        SELECT p.url_photo
        FROM photos_chambre p
        WHERE p.id_chambre = c.id_chambre
        ORDER BY p.id_photo ASC
        LIMIT 1
      ) AS url_photo,
      GROUP_CONCAT(s.nom_service SEPARATOR ', ') AS services
    FROM chambres c

    JOIN type_chambre t ON c.id_type = t.id_type
    LEFT JOIN chambre_service cs ON cs.id_chambre = c.id_chambre
    LEFT JOIN services s ON s.id_service = cs.id_service AND s.statut = 'active'

    WHERE c.statut = 'active'
    GROUP BY c.id_chambre, c.numero, c.prix, c.capacite, c.statut, t.nom_type
    ORDER BY c.numero;
  `;

  const [response] = await bdd.query(allChambre);
  return response;
};

export const getAvailableChambres = async (date_debut, date_fin, personnes = 1) => {
  const sql = `
    SELECT 
      c.id_chambre,
      c.numero,
      c.prix,
      c.capacite,
      c.statut,
      t.nom_type AS type_chambre,
      (
        SELECT p.url_photo
        FROM photos_chambre p
        WHERE p.id_chambre = c.id_chambre
        ORDER BY p.id_photo ASC
        LIMIT 1
      ) AS url_photo,
      GROUP_CONCAT(s.nom_service SEPARATOR ', ') AS services
    FROM chambres c
    JOIN type_chambre t ON c.id_type = t.id_type
    LEFT JOIN chambre_service cs ON cs.id_chambre = c.id_chambre
    LEFT JOIN services s ON s.id_service = cs.id_service AND s.statut = 'active'
    WHERE c.statut = 'active'
      AND c.capacite >= ?
      AND c.id_chambre NOT IN (
        SELECT r.id_chambre
        FROM reservations r
        WHERE r.statut != 'annulee'
          AND r.date_debut < ?
          AND r.date_fin > ?
      )
    GROUP BY c.id_chambre, c.numero, c.prix, c.capacite, c.statut, t.nom_type
    ORDER BY c.numero;
  `;

  const [rows] = await bdd.query(sql, [personnes, date_fin, date_debut]);
  return rows;
};

/* STAFF: tout */
export const getAllChambreStaff = async () => {
  const sql = `
    SELECT 
      c.id_chambre,
      c.numero,
      c.prix,
      c.capacite,
      c.statut,
      c.id_type,
      t.nom_type AS type_chambre,
      GROUP_CONCAT(s.nom_service SEPARATOR ', ') AS services,
      GROUP_CONCAT(s.id_service SEPARATOR ',') AS services_ids
    FROM chambres c
    JOIN type_chambre t ON c.id_type = t.id_type
    LEFT JOIN chambre_service cs ON cs.id_chambre = c.id_chambre
    LEFT JOIN services s ON s.id_service = cs.id_service AND s.statut = 'active'
    GROUP BY c.id_chambre, c.numero, c.prix, c.capacite, c.statut, c.id_type, t.nom_type
    ORDER BY c.numero;
  `;
  const [rows] = await bdd.query(sql);
  return rows;
};


export const getChambreById = async (id_chambre) => {
  const sql = `
  SELECT 
  c.id_chambre,
  c.numero,
  c.prix,
  c.capacite,
  c.statut,
  t.nom_type AS type_chambre,
  (
    SELECT p.url_photo
    FROM photos_chambre p
    WHERE p.id_chambre = c.id_chambre
    ORDER BY p.id_photo ASC
    LIMIT 1
  ) AS url_photo,
  GROUP_CONCAT(s.nom_service SEPARATOR ', ') AS services
  FROM chambres c
  JOIN type_chambre t ON c.id_type = t.id_type
  LEFT JOIN chambre_service cs ON cs.id_chambre = c.id_chambre
  LEFT JOIN services s ON s.id_service = cs.id_service AND s.statut = 'active'
  WHERE c.id_chambre = ?
  GROUP BY c.id_chambre, c.numero, c.prix, c.capacite, c.statut, t.nom_type;
  `;
  const [response] = await bdd.query(sql, [id_chambre]);
  return response[0];
};

export const setChambreStatut = async (id_chambre, statut) => {
  const sql = `UPDATE chambres SET statut = ? WHERE id_chambre = ?;`;
  const [res] = await bdd.query(sql, [statut, id_chambre]);
  return res;
};

export const setChambreServices = async (id_chambre, services = []) => {
  await bdd.query(
    "DELETE FROM chambre_service WHERE id_chambre = ?",
    [id_chambre]
  );

  if (!services.length) return;

  const values = services.map((id_service) => [id_chambre, id_service]);

  await bdd.query(
    "INSERT INTO chambre_service (id_chambre, id_service) VALUES ?",
    [values]
  );
};
