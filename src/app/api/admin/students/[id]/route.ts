import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  fatherName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5).optional(),
  classId: z.string().optional(),
  status: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const student = await prisma.student.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(student);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
