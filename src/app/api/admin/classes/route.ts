import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { classSchema } from "@/lib/validations";

export async function GET() {
  const classes = await prisma.schoolClass.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { students: true } } },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = classSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const schoolClass = await prisma.schoolClass.create({ data: parsed.data });
  return NextResponse.json(schoolClass);
}
