import "dotenv/config";
import "./config/bdd.js";
import express from "express";
import cors from 'cors';
import { checkToken } from "./middlewares/CheckToken.js";
import { checkRole } from "./middlewares/CheckRole.js";
import ChambreRoute from './route/ChambreRoute.js';
import ClientRoute from './route/ClientRoute.js';
import ResaRoute from './route/ResaRoute.js';
import ServiceRoute from './route/ServiceRoute.js';
import ChambreServiceRoute from './route/ChambreServiceRoute.js';
import PhototChambreRoute from './route/PhotoChambreRoute.js';
import TypeChambreRoute from './route/TypeChambreRoute.js';
import EmployeRoute from './route/EmployeRoute.js';
import paiementRoutes from "./route/PaiementRoute.js";
import ContactRoute from "./route/ContactRoute.js";


const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/api/paiements/webhook") {
    return next();
  }
  return express.json()(req, res, next);
});

app.use("/api", ChambreRoute);
app.use("/api", ClientRoute);
app.use("/api", ResaRoute);
app.use("/api", ServiceRoute);
app.use("/api", ChambreServiceRoute);
app.use("/api", PhototChambreRoute);
app.use("/api", TypeChambreRoute);
app.use("/api", EmployeRoute);
app.use("/api", paiementRoutes);
app.use("/api", ContactRoute);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
