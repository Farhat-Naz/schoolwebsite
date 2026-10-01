"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SchoolClass = { id: string; name: string };
type Student = {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  phone: string;
  status: string;
  class: { name: string };
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    phone: "",
    email: "",
    classId: "",
  });

  async function load() {
    setLoading(true);
    const [sRes, cRes] = await Promise.all([
      fetch("/api/admin/students"),
      fetch("/api/admin/classes"),
    ]);
    setStudents(await sRes.json());
    setClasses(await cRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not add student. Check the values.");
      return;
    }
    setForm({
      name: "",
      fatherName: "",
      dateOfBirth: "",
      gender: "Male",
      address: "",
      phone: "",
      email: "",
      classId: "",
    });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">Manage enrolled students.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add Student"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="fatherName">Father Name *</Label>
                <Input id="fatherName" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select id="classId" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required>
                  <option value="">Select a class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2">
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Student"}
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
          ) : students.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No students enrolled yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-4 font-medium">Roll No</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Father</th>
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-mono text-xs">{s.rollNo}</td>
                    <td className="p-4">{s.name}</td>
                    <td className="p-4">{s.fatherName}</td>
                    <td className="p-4">{s.class.name}</td>
                    <td className="p-4">{s.phone}</td>
                    <td className="p-4">
                      <Badge variant={s.status === "ACTIVE" ? "success" : "secondary"}>{s.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>
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
