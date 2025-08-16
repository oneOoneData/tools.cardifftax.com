import { describe, it, expect } from "vitest";
import { computeComp } from "../src/calc";

describe("reasonable-comp v0", () => {
  it("computes a sane range for a CA S‑Corp owner", () => {
    const res = computeComp({
      client: { name: "Acme, Inc.", state: "CA", metro: "San Diego", industryLabel: "Tax Prep" },
      financials: { revenue: 650000, netProfit: 180000 },
      owner: { hoursPerWeek: 45, experienceYears: 12 },
      company: { employees: 4 },
      roleMix: { exec: 0.4, admin: 0.15, bookkeeping: 0.1, sales: 0.2, ops: 0.15, tech: 0.0 },
      benefits: { include: true, estimatedAnnual: 12000 }
    });

    expect(res.marketComposite).toBeGreaterThan(70000);
    expect(res.range.low).toBeLessThan(res.range.high);
    expect(res.benefits.considered).toBe(true);
  });

  it("validates role mix sums to 1.0", () => {
    expect(() =>
      computeComp({
        client: { name: "Bad Co", state: "TX" },
        financials: { revenue: 200000, netProfit: 80000 },
        owner: { hoursPerWeek: 40, experienceYears: 3 },
        company: { employees: 0 },
        roleMix: { exec: 1, admin: 0, bookkeeping: 0, sales: 0, ops: 0, tech: 0.1 },
        benefits: { include: false, estimatedAnnual: 0 }
      } as any)
    ).toThrow();
  });
}); 