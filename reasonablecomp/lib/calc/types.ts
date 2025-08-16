import { z } from "zod";

export const Roles = ["exec","admin","bookkeeping","sales","ops","tech"] as const;
export type Role = typeof Roles[number];

export const CalcRequestSchema = z.object({
  client: z.object({
    name: z.string().min(1),
    state: z.string().length(2),
    metro: z.string().optional(),
    industryLabel: z.string().optional()
  }),
  financials: z.object({
    revenue: z.number().nonnegative(),
    netProfit: z.number()
  }),
  owner: z.object({
    hoursPerWeek: z.number().positive(),
    experienceYears: z.number().nonnegative()
  }),
  company: z.object({
    employees: z.number().int().nonnegative()
  }),
  roleMix: z.record(z.enum(Roles), z.number().min(0).max(1)).refine(
    (m) => Math.abs(Object.values(m).reduce((a, b) => a + b, 0) - 1) < 1e-6,
    { message: "roleMix shares must sum to 1.0" }
  ),
  benefits: z.object({
    include: z.boolean(),
    estimatedAnnual: z.number().nonnegative().default(0)
  })
});
export type CalcRequest = z.infer<typeof CalcRequestSchema>;

export const CalcResultSchema = z.object({
  marketComposite: z.number(),
  modifiers: z.object({
    experience: z.number(),
    companySize: z.number(),
    revenueSignal: z.number(),
    hoursNorm: z.number()
  }),
  target: z.number(),
  range: z.object({ low: z.number(), target: z.number(), high: z.number() }),
  benefits: z.object({ considered: z.boolean(), estimatedAnnual: z.number() }),
  notes: z.array(z.string())
});
export type CalcResult = z.infer<typeof CalcResultSchema>; 