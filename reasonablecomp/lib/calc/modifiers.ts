import type { CalcRequest } from "./types";

export function hoursNorm(h: number){ const r=h/40; return Math.min(1.10, Math.max(0.85, r)); }
export function experienceFactor(y: number){ if(y<=2) return 0.92; if(y<=5) return 0.97; if(y<=10) return 1.03; if(y<=20) return 1.08; return 1.12; }
export function companySizeFactor(e: number){ if(e===0) return 0.95; if(e<=5) return 1.00; if(e<=20) return 1.05; return 1.08; }
export function revenueSignalFactor(r: number){ if(r<200_000) return 0.95; if(r<500_000) return 1.00; if(r<1_500_000) return 1.03; if(r<3_000_000) return 1.06; return 1.08; }

export function buildModifiers(input: CalcRequest){
  const exp = experienceFactor(input.owner.experienceYears);
  const size = companySizeFactor(input.company.employees);
  const rev = revenueSignalFactor(input.financials.revenue);
  const hrs = hoursNorm(input.owner.hoursPerWeek);
  return { experience: exp, companySize: size, revenueSignal: rev, hoursNorm: hrs };
} 