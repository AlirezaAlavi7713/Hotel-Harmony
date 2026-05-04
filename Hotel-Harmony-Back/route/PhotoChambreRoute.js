import express from "express";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";
import { uploadRoomPhotos } from "../middlewares/UploadRoomPhotos.js";
import {
    createPhotoController,
    updatePhotoController,
    deletePhotoController,
    getAllPhotosController,
    getPhotoByIdController,
    getCoverPhotoController,
    getRoomPhotosController,
    replaceRoomPhotosController,
    uploadRoomPhotosController
} from "../controller/PhotoChambreController.js";

const router = express.Router();

router.post("/photo_chambre", createPhotoController);
router.put("/photo_chambre/:id", updatePhotoController);
router.delete("/photo_chambre/:id", deletePhotoController);
router.get("/photos_chambre", getAllPhotosController);
router.get("/photo_chambre/:id", getPhotoByIdController);
router.get("/chambres/:id_chambre/photos", getRoomPhotosController);
router.get("/chambres/:id_chambre/photos/cover", getCoverPhotoController);
router.put("/chambres/:id_chambre/photos", checkToken, checkRole("admin", "employe"), replaceRoomPhotosController);
router.post(
    "/chambres/:id_chambre/photos/upload",
    checkToken,
    checkRole("admin", "employe"),
    uploadRoomPhotos.array("photos", 10),
    uploadRoomPhotosController
);

export default router;
