"use client";
import { clsx } from "clsx";

export function Label({children, className}:{children:React.ReactNode; className?:string}){ 
  return <label className={clsx("text-sm font-medium text-gray-700", className)}>{children}</label> 
}

export function Input({error, className, ...props}: React.InputHTMLAttributes<HTMLInputElement> & {error?: boolean}){
  return (
    <input 
      {...props} 
      className={clsx(
        "w-full border rounded-lg px-3 py-2 outline-none transition-colors",
        error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        className
      )} 
    />
  )
}

export function Select({error, className, children, ...props}: React.SelectHTMLAttributes<HTMLSelectElement> & {error?: boolean}){
  return (
    <select 
      {...props} 
      className={clsx(
        "w-full border rounded-lg px-3 py-2 outline-none transition-colors",
        error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        className
      )}
    >
      {children}
    </select>
  )
}

export function Section({title, children}:{title:string; children:React.ReactNode}){
  return (
    <section className="space-y-3 p-4 border rounded-2xl bg-white shadow-sm">
      {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
      {children}
    </section>
  )
}

export function Row({children}:{children:React.ReactNode}){ 
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">{children}</div> 
} 