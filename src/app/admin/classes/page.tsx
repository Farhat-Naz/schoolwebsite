"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type SchoolClass = {
  id: string;
  name: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  _count: { students: number };
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", tuitionFee: "", admissionFee: "", examFee: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/classes");
    setClasses(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not create class. Check the values.");
      return;
    }
    setForm({ name: "", tuitionFee: "", admissionFee: "", examFee: "" });
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
      <p className="mt-1 text-sm text-slate-500">Manage classes and their fee structure.</p>

      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="grid grid-cols-5 items-end gap-3">
            <div>
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tuitionFee">Tuition Fee</Label>
              <Input
                id="tuitionFee"
                type="number"
                value={form.tuitionFee}
                onChange={(e) => setForm({ ...form, tuitionFee: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="admissionFee">Admission Fee</Label>
              <Input
                id="admissionFee"
                type="number"
                value={form.admissionFee}
                onChange={(e) => setForm({ ...form, admissionFee: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="examFee">Exam Fee</Label>
              <Input
                id="examFee"
                type="number"
                value={form.examFee}
                onChange={(e) => setForm({ ...form, examFee: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Class"}
            </Button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Tuition Fee</th>
                  <th className="p-4 font-medium">Admission Fee</th>
                  <th className="p-4 font-medium">Exam Fee</th>
                  <th className="p-4 font-medium">Students</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">Rs. {c.tuitionFee.toFixed(0)}</td>
                    <td className="p-4">Rs. {c.admissionFee.toFixed(0)}</td>
                    <td className="p-4">Rs. {c.examFee.toFixed(0)}</td>
                    <td className="p-4">{c._count.students}</td>
                    <td className="p-4">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                        Delete
                      </Button>
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
