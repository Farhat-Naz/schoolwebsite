import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { voucherSchema } from "@/lib/validations";
import { generateVoucherNo } from "@/lib/ids";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vouchers = await prisma.feeVoucher.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { include: { class: true } } },
  });
  return NextResponse.json(vouchers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const totalAmount =
    data.tuitionFee +
    data.admissionFee +
    data.examFee +
    data.otherFee +
    data.fine -
    data.discount;

  const voucher = await prisma.feeVoucher.create({
    data: {
      voucherNo: generateVoucherNo(),
      studentId: data.studentId,
      month: data.month,
      year: data.year,
      tuitionFee: data.tuitionFee,
      admissionFee: data.admissionFee,
      examFee: data.examFee,
      otherFee: data.otherFee,
      fine: data.fine,
      discount: data.discount,
      totalAmount,
      dueDate: new Date(data.dueDate),
    },
  });

  return NextResponse.json(voucher);
}
