import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const baseName = path
      .basename(file.originalname || "room-photo", ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "room-photo";

    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (file.mimetype?.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Seules les images sont autorisees"));
}

export const uploadRoomPhotos = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },
});
