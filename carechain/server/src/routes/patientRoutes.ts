import { Router } from "express";
import { getPatient, listPatients } from "../controllers/patientController";

export const patientRoutes = Router();
patientRoutes.get("/", listPatients);
patientRoutes.get("/:id", getPatient);