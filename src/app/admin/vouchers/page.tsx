"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type SchoolClass = { id: string; name: string; tuitionFee: number; examFee: number };
type Student = { id: string; name: string; rollNo: string; class: { name: string } };
type Voucher = {
  id: string;
  voucherNo: string;
  month: string;
  year: number;
  totalAmount: number;
  status: "UNPAID" | "PAID" | "OVERDUE";
  dueDate: string;
  student: { name: string; rollNo: string; class: { name: string } };
};

const statusVariant = { UNPAID: "warning", PAID: "success", OVERDUE: "danger" } as const;
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"single" | "bulk" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [singleForm, setSingleForm] = useState({
    studentId: "", month: months[new Date().getMonth()], year: new Date().getFullYear(),
    tuitionFee: "", admissionFee: "0", examFee: "0", otherFee: "0", fine: "0", discount: "0", dueDate: "",
  });
  const [bulkForm, setBulkForm] = useState({
    classId: "", month: months[new Date().getMonth()], year: new Date().getFullYear(),
    dueDate: "", fine: "0", discount: "0",
  });

  async function load() {
    setLoading(true);
    const [vRes, sRes, cRes] = await Promise.all([
      fetch("/api/admin/vouchers"),
      fetch("/api/admin/students"),
      fetch("/api/admin/classes"),
    ]);
    setVouchers(await vRes.json());
    setStudents(await sRes.json());
    setClasses(await cRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSingleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(singleForm),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not generate voucher. Check the values.");
      return;
    }
    setMode(null);
    load();
  }

  async function handleBulkCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/vouchers/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkForm),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError("Could not generate vouchers. Check the values.");
      return;
    }
    setMessage(`Generated ${json.count} vouchers.`);
    setMode(null);
    load();
  }

  async function markPaid(id: string) {
    await fetch(`/api/admin/vouchers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" }),
    });
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Vouchers</h1>
          <p className="mt-1 text-sm text-slate-500">Generate and manage student fee vouchers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode(mode === "single" ? null : "single")}>
            Generate Single
          </Button>
          <Button onClick={() => setMode(mode === "bulk" ? null : "bulk")}>
            Generate for Class
          </Button>
        </div>
      </div>

      {message && <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      {mode === "single" && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <form onSubmit={handleSingleCreate} className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="studentId">Student *</Label>
                <Select
                  id="studentId"
                  value={singleForm.studentId}
                  onChange={(e) => setSingleForm({ ...singleForm, studentId: e.target.value })}
                  required
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo}) - {s.class.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="month">Month *</Label>
                <Select id="month" value={singleForm.month} onChange={(e) => setSingleForm({ ...singleForm, month: e.target.value })}>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input id="year" type="number" value={singleForm.year} onChange={(e) => setSingleForm({ ...singleForm, year: Number(e.target.value) })} required />
              </div>
              <div>
                <Label htmlFor="tuitionFee">Tuition Fee *</Label>
                <Input id="tuitionFee" type="number" value={singleForm.tuitionFee} onChange={(e) => setSingleForm({ ...singleForm, tuitionFee: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="admissionFee">Admission Fee</Label>
                <Input id="admissionFee" type="number" value={singleForm.admissionFee} onChange={(e) => setSingleForm({ ...singleForm, admissionFee: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="examFee">Exam Fee</Label>
                <Input id="examFee" type="number" value={singleForm.examFee} onChange={(e) => setSingleForm({ ...singleForm, examFee: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="otherFee">Other Fee</Label>
                <Input id="otherFee" type="number" value={singleForm.otherFee} onChange={(e) => setSingleForm({ ...singleForm, otherFee: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="fine">Fine</Label>
                <Input id="fine" type="number" value={singleForm.fine} onChange={(e) => setSingleForm({ ...singleForm, fine: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input id="discount" type="number" value={singleForm.discount} onChange={(e) => setSingleForm({ ...singleForm, discount: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" value={singleForm.dueDate} onChange={(e) => setSingleForm({ ...singleForm, dueDate: e.target.value })} required />
              </div>
              <div className="col-span-4">
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={saving}>{saving ? "Generating..." : "Generate Voucher"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "bulk" && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <form onSubmit={handleBulkCreate} className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select id="classId" value={bulkForm.classId} onChange={(e) => setBulkForm({ ...bulkForm, classId: e.target.value })} required>
                  <option value="">Select class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="bMonth">Month *</Label>
                <Select id="bMonth" value={bulkForm.month} onChange={(e) => setBulkForm({ ...bulkForm, month: e.target.value })}>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="bYear">Year *</Label>
                <Input id="bYear" type="number" value={bulkForm.year} onChange={(e) => setBulkForm({ ...bulkForm, year: Number(e.target.value) })} required />
              </div>
              <div>
                <Label htmlFor="bDueDate">Due Date *</Label>
                <Input id="bDueDate" type="date" value={bulkForm.dueDate} onChange={(e) => setBulkForm({ ...bulkForm, dueDate: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="bFine">Fine</Label>
                <Input id="bFine" type="number" value={bulkForm.fine} onChange={(e) => setBulkForm({ ...bulkForm, fine: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="bDiscount">Discount</Label>
                <Input id="bDiscount" type="number" value={bulkForm.discount} onChange={(e) => setBulkForm({ ...bulkForm, discount: e.target.value })} />
              </div>
              <div className="col-span-4">
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={saving}>
                  {saving ? "Generating..." : "Generate for All Active Students in Class"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading...</p>
          ) : vouchers.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No vouchers generated yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-4 font-medium">Voucher No</th>
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Period</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-mono text-xs">{v.voucherNo}</td>
                    <td className="p-4">{v.student.name} ({v.student.rollNo})</td>
                    <td className="p-4">{v.student.class.name}</td>
                    <td className="p-4">{v.month} {v.year}</td>
                    <td className="p-4">Rs. {v.totalAmount.toFixed(0)}</td>
                    <td className="p-4"><Badge variant={statusVariant[v.status]}>{v.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <a href={`/api/vouchers/${v.id}/pdf`} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                        </a>
                        {v.status !== "PAID" && (
                          <Button size="sm" onClick={() => markPaid(v.id)}>Mark Paid</Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
