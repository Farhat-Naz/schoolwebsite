"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Admission = {
  id: string;
  applicationNo: string;
  studentName: string;
  fatherName: string;
  phone: string;
  classAppliedFor: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

const statusVariant = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
} as const;

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/admissions");
    const json = await res.json();
    setAdmissions(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setMessage(null);
    const res = await fetch(`/api/admin/admissions/${id}/${action}`, { method: "POST" });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setMessage(json.error || "Action failed");
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admissions</h1>
      <p className="mt-1 text-sm text-slate-500">
        Review and process admission applications. Approving creates a student record.
      </p>

      {message && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{message}</p>
      )}

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading...</p>
          ) : admissions.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No admission applications yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="p-4 font-medium">Application No</th>
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Father</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-mono text-xs">{a.applicationNo}</td>
                    <td className="p-4">{a.studentName}</td>
                    <td className="p-4">{a.fatherName}</td>
                    <td className="p-4">{a.phone}</td>
                    <td className="p-4">{a.classAppliedFor}</td>
                    <td className="p-4">
                      <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                    </td>
                    <td className="p-4">
                      {a.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={busyId === a.id}
                            onClick={() => act(a.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={busyId === a.id}
                            onClick={() => act(a.id, "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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
