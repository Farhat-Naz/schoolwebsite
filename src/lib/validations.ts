import { z } from "zod";

export const admissionSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  cnicOrBForm: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  classAppliedFor: z.string().min(1, "Please select a class"),
  previousSchool: z.string().optional(),
});

export type AdmissionInput = z.infer<typeof admissionSchema>;

export const classSchema = z.object({
  name: z.string().min(1),
  tuitionFee: z.coerce.number().min(0),
  admissionFee: z.coerce.number().min(0),
  examFee: z.coerce.number().min(0),
});

export type ClassInput = z.infer<typeof classSchema>;

export const voucherSchema = z.object({
  studentId: z.string().min(1),
  month: z.string().min(1),
  year: z.coerce.number().min(2000),
  tuitionFee: z.coerce.number().min(0),
  admissionFee: z.coerce.number().min(0).default(0),
  examFee: z.coerce.number().min(0).default(0),
  otherFee: z.coerce.number().min(0).default(0),
  fine: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  dueDate: z.string().min(1),
});

export type VoucherInput = z.infer<typeof voucherSchema>;
