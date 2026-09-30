import type { Request, Response } from "express";
import { patientService } from "../services/patientService";

export async function listPatients(_request: Request, response: Response): Promise<void> {
  response.json(await patientService.list());
}

export async function getPatient(request: Request, response: Response): Promise<void> {
  const patient = await patientService.getById(request.params.id);
  if (!patient) {
    response.status(404).json({ error: "Patient not found" });
    return;
  }
  response.json(patient);
}