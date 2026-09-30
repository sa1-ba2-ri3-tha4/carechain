import { prisma } from "../utils/prisma";

export const patientService = {
  list: () => prisma.patient.findMany({ orderBy: { name: "asc" } }),
  getById: (id: string) => prisma.patient.findUnique({ where: { id } }),
};