import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Receipt, GraduationCap } from "lucide-react";

export default async function AdminDashboard() {
  const [studentCount, pendingAdmissions, classCount, unpaidVouchers] = await Promise.all([
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.admission.count({ where: { status: "PENDING" } }),
    prisma.schoolClass.count(),
    prisma.feeVoucher.count({ where: { status: "UNPAID" } }),
  ]);

  const stats = [
    { label: "Active Students", value: studentCount, icon: Users },
    { label: "Pending Admissions", value: pendingAdmissions, icon: FileText },
    { label: "Classes", value: classCount, icon: GraduationCap },
    { label: "Unpaid Vouchers", value: unpaidVouchers, icon: Receipt },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of your school system</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{s.label}</CardTitle>
              <s.icon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
