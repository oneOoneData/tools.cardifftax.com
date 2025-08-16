export type WageRow = { state: string; role: string; annual: number };

export interface WageSource {
  getBaseline(state: string, role: string): number;
}

export class JsonWageSource implements WageSource {
  private table: Record<string, Record<string, number>>;
  constructor(table: Record<string, Record<string, number>>) {
    this.table = table;
  }
  getBaseline(state: string, role: string): number {
    const byState = this.table[state] ?? this.table["CA"];
    const wage = byState[role];
    if (wage == null) throw new Error(`No baseline wage for role "${role}" in state "${state}"`);
    return wage;
  }
}

// Placeholder for future Postgres source (Prisma/SQL):
export class PgWageSource implements WageSource {
  // constructor(private prisma: PrismaClient) {}
  getBaseline(_state: string, _role: string): number {
    throw new Error("PgWageSource not implemented yet");
  }
} 