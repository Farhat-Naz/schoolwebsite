import Link from "next/link";
import { AuthSessionProvider } from "@/components/session-provider";
import { auth } from "@/auth";
import { LayoutDashboard, FileText, Users, GraduationCap, Receipt, Settings } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admissions", label: "Admissions", icon: FileText },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/classes", label: "Classes", icon: GraduationCap },
  { href: "/admin/vouchers", label: "Fee Vouchers", icon: Receipt },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <AuthSessionProvider>{children}</AuthSessionProvider>;
  }

  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen bg-slate-50">
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5 font-semibold text-slate-900">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            School Admin
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 p-4">
            <p className="mb-2 truncate text-xs text-slate-500">{session.user?.email}</p>
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AuthSessionProvider>
  );
}
