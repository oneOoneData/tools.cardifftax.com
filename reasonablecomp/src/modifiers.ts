import type { CalcRequest } from "./types";

export function hoursNorm(hoursPerWeek: number) {
  const ratio = hoursPerWeek / 40;
  return Math.min(1.10, Math.max(0.85, ratio));
}

export function experienceFactor(years: number) {
  if (years <= 2) return 0.92;
  if (years <= 5) return 0.97;
  if (years <= 10) return 1.03;
  if (years <= 20) return 1.08;
  return 1.12;
}

export function companySizeFactor(employees: number) {
  if (employees === 0) return 0.95;
  if (employees <= 5) return 1.00;
  if (employees <= 20) return 1.05;
  return 1.08;
}

export function revenueSignalFactor(revenue: number) {
  if (revenue < 200_000) return 0.95;
  if (revenue < 500_000) return 1.00;
  if (revenue < 1_500_000) return 1.03;
  if (revenue < 3_000_000) return 1.06;
  return 1.08;
}

export function buildModifiers(input: CalcRequest) {
  const exp = experienceFactor(input.owner.experienceYears);
  const size = companySizeFactor(input.company.employees);
  const rev = revenueSignalFactor(input.financials.revenue);
  const hrs = hoursNorm(input.owner.hoursPerWeek);
  return { experience: exp, companySize: size, revenueSignal: rev, hoursNorm: hrs };
} 