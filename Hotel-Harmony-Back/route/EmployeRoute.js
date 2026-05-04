import express from "express";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";
import {
  createEmployeController,
  updateEmployeController,
  deleteEmployeController,
  getAllEmployeController,
  getEmployeByIdController,
  loginController
} from "../controller/EmployeController.js";

const router = express.Router();

// ✅ LOGIN: public
router.post("/employes/login", loginController);

// ✅ CRUD employés: admin only
router.post("/employe", checkToken, checkRole("admin"), createEmployeController);
router.put("/employe/:id", checkToken, checkRole("admin"), updateEmployeController);
router.delete("/employe/:id", checkToken, checkRole("admin"), deleteEmployeController);
router.get("/employes", checkToken, checkRole("admin"), getAllEmployeController);
router.get("/employe/:id", checkToken, checkRole("admin"), getEmployeByIdController);

export default router;