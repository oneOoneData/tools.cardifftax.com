import table from "./seed/wages.v0.json" assert { type: "json" };
import { CalcRequestSchema, type CalcRequest, type CalcResult } from "./types";
import { buildModifiers } from "./modifiers";
import { JsonWageSource, type WageSource } from "./data/wageSource";

const defaultSource: WageSource = new JsonWageSource(table as any);

export function computeComp(raw: CalcRequest, source: WageSource = defaultSource): CalcResult {
  const input = CalcRequestSchema.parse(raw);

  const mc = (Object.entries(input.roleMix) as [string, number][])
    .reduce((sum, [role, share]) => {
      const baseline = source.getBaseline(input.client.state, role);
      return sum + baseline * share;
    }, 0);

  const mods = buildModifiers(input);
  const modsProduct = mods.experience * mods.companySize * mods.revenueSignal * mods.hoursNorm;

  const target = mc * modsProduct;
  const low = target * 0.90;
  const high = target * 1.15;

  return {
    marketComposite: Math.round(mc),
    modifiers: mods,
    target: Math.round(target),
    range: { low: Math.round(low), target: Math.round(target), high: Math.round(high) },
    benefits: { considered: input.benefits.include, estimatedAnnual: input.benefits.estimatedAnnual ?? 0 },
    notes: [
      "Seed baseline: wages.v0.json (state-only)",
      "Role mix provided by user (must sum to 1.0)",
      "Bands: Low=−10%, High=+15% from Target",
      "Benefits displayed separately from W‑2"
    ]
  };
} 