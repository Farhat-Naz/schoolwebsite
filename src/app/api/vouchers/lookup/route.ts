import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const rollNo = req.nextUrl.searchParams.get("rollNo")?.trim();
  if (!rollNo) {
    return NextResponse.json({ error: "Roll number is required" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { rollNo },
    include: {
      class: true,
      vouchers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "No student found with that roll number" }, { status: 404 });
  }

  return NextResponse.json({
    student: {
      name: student.name,
      rollNo: student.rollNo,
      className: student.class.name,
    },
    vouchers: student.vouchers,
  });
}
