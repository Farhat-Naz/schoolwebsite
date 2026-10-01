import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateVoucherNo } from "@/lib/ids";
import { z } from "zod";

const bulkSchema = z.object({
  classId: z.string().min(1),
  month: z.string().min(1),
  year: z.coerce.number().min(2000),
  dueDate: z.string().min(1),
  fine: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const schoolClass = await prisma.schoolClass.findUnique({
    where: { id: data.classId },
    include: { students: { where: { status: "ACTIVE" } } },
  });
  if (!schoolClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 400 });
  }

  const totalAmount =
    schoolClass.tuitionFee + schoolClass.examFee + data.fine - data.discount;

  const vouchers = await prisma.$transaction(
    schoolClass.students.map((student) =>
      prisma.feeVoucher.create({
        data: {
          voucherNo: generateVoucherNo(),
          studentId: student.id,
          month: data.month,
          year: data.year,
          tuitionFee: schoolClass.tuitionFee,
          admissionFee: 0,
          examFee: schoolClass.examFee,
          otherFee: 0,
          fine: data.fine,
          discount: data.discount,
          totalAmount,
          dueDate: new Date(data.dueDate),
        },
      })
    )
  );

  return NextResponse.json({ count: vouchers.length });
}
