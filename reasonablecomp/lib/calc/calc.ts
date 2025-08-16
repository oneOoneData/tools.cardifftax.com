import table from "./seed/wages.v0.json";
import { CalcRequestSchema, type CalcRequest, type CalcResult } from "./types";
import { buildModifiers } from "./modifiers";
import { JsonWageSource } from "./wageSource";

const source = new JsonWageSource(table as any);

export function computeComp(raw: CalcRequest): CalcResult {
  const input = CalcRequestSchema.parse(raw);
  const mc = (Object.entries(input.roleMix) as [string, number][])
    .reduce((sum, [role, share]) => sum + source.getBaseline(input.client.state, role) * share, 0);
  const mods = buildModifiers(input);
  const prod = mods.experience * mods.companySize * mods.revenueSignal * mods.hoursNorm;
  const target = mc * prod;
  return {
    marketComposite: Math.round(mc),
    modifiers: mods,
    target: Math.round(target),
    range: { low: Math.round(target*0.90), target: Math.round(target), high: Math.round(target*1.15) },
    benefits: { considered: input.benefits.include, estimatedAnnual: input.benefits.estimatedAnnual ?? 0 },
    notes: [
      "Seed baseline: wages.v0.json (state-only)",
      "Role mix must sum to 1.0",
      "Bands: Low −10%, High +15%",
      "Benefits shown separately"
    ]
  };
} 