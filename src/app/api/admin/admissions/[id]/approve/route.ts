import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateRollNo } from "@/lib/ids";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const admission = await prisma.admission.findUnique({ where: { id } });
  if (!admission) {
    return NextResponse.json({ error: "Admission not found" }, { status: 404 });
  }
  if (admission.status !== "PENDING") {
    return NextResponse.json({ error: "Admission already processed" }, { status: 400 });
  }

  const schoolClass = await prisma.schoolClass.findUnique({
    where: { name: admission.classAppliedFor },
  });
  if (!schoolClass) {
    return NextResponse.json(
      { error: `Class "${admission.classAppliedFor}" does not exist. Create it first.` },
      { status: 400 }
    );
  }

  const student = await prisma.$transaction(async (tx) => {
    const created = await tx.student.create({
      data: {
        rollNo: generateRollNo(schoolClass.name),
        name: admission.studentName,
        fatherName: admission.fatherName,
        dateOfBirth: admission.dateOfBirth,
        gender: admission.gender,
        address: admission.address,
        phone: admission.phone,
        email: admission.email,
        classId: schoolClass.id,
        admissionId: admission.id,
      },
    });

    await tx.admission.update({
      where: { id: admission.id },
      data: { status: "APPROVED" },
    });

    return created;
  });

  return NextResponse.json({ student });
}
