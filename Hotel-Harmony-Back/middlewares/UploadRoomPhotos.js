import multer from "multer";

const storage = multer.memoryStorage();

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
