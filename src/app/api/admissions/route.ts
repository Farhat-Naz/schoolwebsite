import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { admissionSchema } from "@/lib/validations";
import { generateApplicationNo } from "@/lib/ids";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = admissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const admission = await prisma.admission.create({
    data: {
      applicationNo: generateApplicationNo(),
      studentName: data.studentName,
      fatherName: data.fatherName,
      motherName: data.motherName || null,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      cnicOrBForm: data.cnicOrBForm || null,
      address: data.address,
      phone: data.phone,
      email: data.email || null,
      classAppliedFor: data.classAppliedFor,
      previousSchool: data.previousSchool || null,
    },
  });

  return NextResponse.json({ applicationNo: admission.applicationNo });
}
