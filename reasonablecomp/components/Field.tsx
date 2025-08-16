"use client";
import { clsx } from "clsx";
export function Label({children}:{children:React.ReactNode}){ return <label className="text-sm font-medium">{children}</label> }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={clsx("w-full border rounded-lg px-3 py-2 outline-none", props.className)} />
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>){
  return <select {...props} className={clsx("w-full border rounded-lg px-3 py-2 outline-none", props.className)} />
}
export function Section({title, children}:{title:string; children:React.ReactNode}){
  return <section className="space-y-3 p-4 border rounded-2xl bg-white shadow-sm">{title && <h2 className="text-lg font-semibold">{title}</h2>}{children}</section>;
}
export function Row({children}:{children:React.ReactNode}){ return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div> } 