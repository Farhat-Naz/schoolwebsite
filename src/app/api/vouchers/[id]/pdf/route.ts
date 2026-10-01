import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { VoucherDocument } from "@/components/pdf/VoucherDocument";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const voucher = await prisma.feeVoucher.findUnique({
    where: { id },
    include: { student: { include: { class: true } } },
  });

  if (!voucher) {
    return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    VoucherDocument({
      data: {
        schoolName: process.env.SCHOOL_NAME || "School",
        voucherNo: voucher.voucherNo,
        studentName: voucher.student.name,
        fatherName: voucher.student.fatherName,
        rollNo: voucher.student.rollNo,
        className: voucher.student.class.name,
        month: voucher.month,
        year: voucher.year,
        tuitionFee: voucher.tuitionFee,
        admissionFee: voucher.admissionFee,
        examFee: voucher.examFee,
        otherFee: voucher.otherFee,
        fine: voucher.fine,
        discount: voucher.discount,
        totalAmount: voucher.totalAmount,
        dueDate: voucher.dueDate.toLocaleDateString(),
        status: voucher.status,
      },
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="voucher-${voucher.voucherNo}.pdf"`,
    },
  });
}
