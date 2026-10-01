import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span>Greenwood Public School</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/admission" className="hover:text-blue-600">Admission</Link>
          <Link href="/fee-voucher" className="hover:text-blue-600">Fee Voucher</Link>
          <Link
            href="/admin/login"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
