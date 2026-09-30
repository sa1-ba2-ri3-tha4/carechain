import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.patient.upsert({
    where: { id: "demo-patient" },
    update: {},
    create: {
      id: "demo-patient",
      name: "Ravi Patel",
      careTeam: "Northstar Recovery Team",
      dischargeDate: new Date("2026-09-22T12:00:00.000Z"),
      recoveryPercent: 68,
      nextAppointment: new Date("2026-10-02T14:30:00.000Z"),
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());