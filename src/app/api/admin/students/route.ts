import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateRollNo } from "@/lib/ids";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(2),
  fatherName: z.string().min(2),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(5),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  classId: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: { class: true },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const schoolClass = await prisma.schoolClass.findUnique({ where: { id: data.classId } });
  if (!schoolClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 400 });
  }

  const student = await prisma.student.create({
    data: {
      rollNo: generateRollNo(schoolClass.name),
      name: data.name,
      fatherName: data.fatherName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      email: data.email || null,
      classId: data.classId,
    },
  });

  return NextResponse.json(student);
}
