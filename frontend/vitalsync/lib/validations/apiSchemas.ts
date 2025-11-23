import { z } from 'zod'

// Doctors
export const doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  specialties: z.array(z.string()).optional(),
  cmp: z.string(),
  rating: z.number(),
  ratingCount: z.number(),
  location: z.string(),
  insurances: z.array(z.string()),
  imageUrl: z.string().url().or(z.string()),
})

export const doctorDetailSchema = doctorSchema.extend({
  specialties: z.array(z.string()).default([]),
  bio: z.string(),
  yearsExperience: z.number(),
  languages: z.array(z.string()),
  education: z.string(),
  clinicAddress: z.string(),
  schedule: z
    .array(z.object({ day: z.string(), slots: z.array(z.string()).nullable().optional() }))
    .optional(),
  coordinates: z
    .object({ latitude: z.number(), longitude: z.number() })
    .optional(),
})

export const doctorReviewSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.string(),
})

export const doctorDetailResponseSchema = z.object({
  doctor: doctorDetailSchema,
  reviews: z.array(doctorReviewSchema),
})

export const doctorListResponseSchema = z.object({
  items: z.array(doctorSchema),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
})

// Locations
export const userLocationEntrySchema = z.object({
  id: z.string(),
  label: z.string(),
  addressLine: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  tag: z.enum(['home', 'office', 'other']),
  isPrimary: z.boolean().optional(),
})

export const userLocationResponseSchema = z.object({
  items: z.array(userLocationEntrySchema),
})

// Medicines
export const medicineListResponseSchema = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
})