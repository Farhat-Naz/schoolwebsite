import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Receipt, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteNav />

      <section className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Welcome to Greenwood Public School
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Apply for admission online and generate your monthly fee voucher
          in seconds — no visit to the school office required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/admission">
            <Button size="lg">Apply for Admission</Button>
          </Link>
          <Link href="/fee-voucher">
            <Button size="lg" variant="outline">Get Fee Voucher</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-20 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-blue-600" />
            <CardTitle className="mt-2">Online Admission</CardTitle>
            <CardDescription>
              Submit your child&apos;s admission application online and track
              its status with your application number.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Receipt className="h-8 w-8 text-blue-600" />
            <CardTitle className="mt-2">Fee Voucher Generator</CardTitle>
            <CardDescription>
              Search by roll number to view and download printable monthly
              fee vouchers as PDF.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <CardTitle className="mt-2">Admin Panel</CardTitle>
            <CardDescription>
              Staff can manage admissions, students, classes, and generate
              fee vouchers in bulk from a secure dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Greenwood Public School. All rights reserved.
      </footer>
    </div>
  );
}
