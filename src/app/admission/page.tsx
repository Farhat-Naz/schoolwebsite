"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteNav } from "@/components/site-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { admissionSchema, type AdmissionInput } from "@/lib/validations";

type SchoolClass = { id: string; name: string };

export default function AdmissionPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionInput>({ resolver: zodResolver(admissionSchema) });

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((data) => setClasses(Array.isArray(data) ? data : []));
  }, []);

  async function onSubmit(data: AdmissionInput) {
    setError(null);
    const res = await fetch("/api/admissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setError("Something went wrong. Please check your details and try again.");
      return;
    }
    const json = await res.json();
    setSubmitted(json.applicationNo);
    reset();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Admission Application Form</CardTitle>
            <CardDescription>
              Fill in the form below to apply for admission. You will receive
              an application number to track your status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-md bg-green-50 p-4 text-green-800">
                <p className="font-semibold">Application submitted successfully!</p>
                <p className="mt-1 text-sm">
                  Your application number is{" "}
                  <span className="font-mono font-bold">{submitted}</span>.
                  Please save this for future reference.
                </p>
                <Button className="mt-4" onClick={() => setSubmitted(null)}>
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input id="studentName" {...register("studentName")} />
                  {errors.studentName && (
                    <p className="mt-1 text-xs text-red-600">{errors.studentName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                    <Input id="fatherName" {...register("fatherName")} />
                    {errors.fatherName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fatherName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="motherName">Mother&apos;s Name</Label>
                    <Input id="motherName" {...register("motherName")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select id="gender" {...register("gender")}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cnicOrBForm">CNIC / B-Form Number</Label>
                  <Input id="cnicOrBForm" {...register("cnicOrBForm")} />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" {...register("address")} />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="classAppliedFor">Class Applying For *</Label>
                  <Select id="classAppliedFor" {...register("classAppliedFor")}>
                    <option value="">Select a class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </Select>
                  {errors.classAppliedFor && (
                    <p className="mt-1 text-xs text-red-600">{errors.classAppliedFor.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="previousSchool">Previous School (if any)</Label>
                  <Input id="previousSchool" {...register("previousSchool")} />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
