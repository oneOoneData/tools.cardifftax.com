"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalcRequestSchema, Roles } from "../src/types";
import { computeComp } from "../src/calc";
import ResultCard from "../components/ResultCard";
import { Input, Select, Section, Row, Label } from "../components/Field";

const FormSchema = CalcRequestSchema;

type FormData = z.infer<typeof FormSchema>;

const defaultRoleMix = { exec:0.4, admin:0.15, bookkeeping:0.10, sales:0.20, ops:0.15, tech:0.0 };

export default function Page(){
  const { register, handleSubmit, watch, formState:{ errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      client: { name: "Acme, Inc.", state: "CA", metro: "San Diego", industryLabel: "Tax Prep" },
      financials: { revenue: 650000, netProfit: 180000 },
      owner: { hoursPerWeek: 45, experienceYears: 12 },
      company: { employees: 4 },
      roleMix: defaultRoleMix as any,
      benefits: { include: true, estimatedAnnual: 12000 }
    }
  });

  const onSubmit = () => {}; // we compute live via watch
  const values = watch();

  const result = useMemo(() => {
    try { return computeComp(values as any); } catch { return null; }
  }, [values]);

  const sumShare = Object.values(values.roleMix ?? {}).reduce((a:any,b:any)=>a+(+b||0),0);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reasonable Compensation Calculator (Prototype)</h1>
        <button onClick={()=>window.print()} className="no-print px-4 py-2 rounded-xl bg-black text-white">Print</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Client & Company">
          <Row>
            <div><Label>Client Name</Label><Input {...register("client.name")} /></div>
            <div>
              <Label>State</Label>
              <Select {...register("client.state")}>
                {["CA","TX","NY"].map(s=><option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div><Label>Metro (optional)</Label><Input {...register("client.metro")} /></div>
          </Row>
          <Row>
            <div><Label>Revenue</Label><Input type="number" min={0} step="1000" {...register("financials.revenue",{ valueAsNumber:true })} /></div>
            <div><Label>Net Profit</Label><Input type="number" step="1000" {...register("financials.netProfit",{ valueAsNumber:true })} /></div>
            <div><Label>Employees</Label><Input type="number" min={0} {...register("company.employees",{ valueAsNumber:true })} /></div>
          </Row>
        </Section>

        <Section title="Owner Profile">
          <Row>
            <div><Label>Hours/Week</Label><Input type="number" min={1} max={80} {...register("owner.hoursPerWeek",{ valueAsNumber:true })} /></div>
            <div><Label>Experience (years)</Label><Input type="number" min={0} max={50} {...register("owner.experienceYears",{ valueAsNumber:true })} /></div>
            <div>
              <Label>Include Benefits?</Label>
              <Select {...register("benefits.include")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          </Row>
          <Row>
            <div><Label>Estimated Annual Benefits</Label><Input type="number" min={0} step="500" {...register("benefits.estimatedAnnual",{ valueAsNumber:true })} /></div>
            <div className="md:col-span-2"><Label>Industry Label (v0: cosmetic)</Label><Input {...register("client.industryLabel")} /></div>
          </Row>
        </Section>

        <Section title={`Role Mix (must sum to 1.0) — current: ${sumShare.toFixed(2)}`}>
          <Row>
            {Roles.map((r)=>(
              <div key={r}>
                <Label>{r}</Label>
                <Input type="number" step="0.01" min={0} max={1} {...register(`roleMix.${r}` as const, { valueAsNumber:true })} />
              </div>
            ))}
          </Row>
          {Math.abs(sumShare-1)>1e-6 && <div className="text-sm text-red-600">Role shares must sum to 1.00</div>}
        </Section>
      </form>

      {result && (
        <Section title="Results">
          <ResultCard result={result as any} />
          <div className="text-xs text-gray-500 mt-2">
            Notes: {result.notes.join(" • ")}
          </div>
        </Section>
      )}

      <footer className="text-center text-xs text-gray-500 py-8">
        Prototype only. Not legal or tax advice.
      </footer>
    </main>
  );
} 