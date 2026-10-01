import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@school.com",
      passwordHash,
    },
  });

  const classes = [
    { name: "Nursery", tuitionFee: 2000, admissionFee: 3000, examFee: 300 },
    { name: "KG", tuitionFee: 2200, admissionFee: 3000, examFee: 300 },
    { name: "Class 1", tuitionFee: 2500, admissionFee: 3500, examFee: 500 },
    { name: "Class 2", tuitionFee: 2500, admissionFee: 3500, examFee: 500 },
    { name: "Class 3", tuitionFee: 2800, admissionFee: 3500, examFee: 500 },
    { name: "Class 4", tuitionFee: 2800, admissionFee: 3500, examFee: 500 },
    { name: "Class 5", tuitionFee: 3000, admissionFee: 4000, examFee: 600 },
  ];

  for (const c of classes) {
    await prisma.schoolClass.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }

  console.log("Seed complete. Admin login: admin@school.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
