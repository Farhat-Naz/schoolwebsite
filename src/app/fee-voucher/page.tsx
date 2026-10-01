"use client";

import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";

type Voucher = {
  id: string;
  voucherNo: string;
  month: string;
  year: number;
  totalAmount: number;
  status: "UNPAID" | "PAID" | "OVERDUE";
  dueDate: string;
};

type LookupResult = {
  student: { name: string; rollNo: string; className: string };
  vouchers: Voucher[];
};

const statusVariant = {
  UNPAID: "warning",
  PAID: "success",
  OVERDUE: "danger",
} as const;

export default function FeeVoucherPage() {
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/vouchers/lookup?rollNo=${encodeURIComponent(rollNo.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Not found");
        return;
      }
      setResult(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Fee Voucher</CardTitle>
            <CardDescription>
              Enter your roll number to view and download your fee vouchers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex items-end gap-3">
              <div className="flex-1">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  placeholder="e.g. CLA-1234"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {result && (
              <div className="mt-6">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{result.student.name}</span>{" "}
                  &middot; {result.student.className} &middot; Roll No:{" "}
                  {result.student.rollNo}
                </p>

                {result.vouchers.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No fee vouchers have been generated yet for this student.
                  </p>
                ) : (
                  <div className="mt-4 divide-y divide-slate-200 rounded-md border border-slate-200">
                    {result.vouchers.map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {v.month} {v.year}
                          </p>
                          <p className="text-xs text-slate-500">
                            Voucher #{v.voucherNo} &middot; Due{" "}
                            {new Date(v.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusVariant[v.status]}>{v.status}</Badge>
                          <span className="font-semibold">Rs. {v.totalAmount.toFixed(0)}</span>
                          <a href={`/api/vouchers/${v.id}/pdf`} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
