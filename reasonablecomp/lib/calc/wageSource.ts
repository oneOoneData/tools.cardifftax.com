export interface WageSource { getBaseline(state: string, role: string): number; }

export class JsonWageSource implements WageSource {
  constructor(private table: Record<string, Record<string, number>>) {}
  getBaseline(state: string, role: string): number {
    const byState = this.table[state] ?? this.table["CA"];
    const wage = byState[role];
    if (wage == null) throw new Error(`No baseline for role "${role}" in state "${state}"`);
    return wage;
  }
} 