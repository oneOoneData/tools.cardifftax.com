"use client";
export function Currency({value}:{value:number}){ return <span>${value.toLocaleString()}</span>; }
export default function ResultCard({result}:{result: {
  range:{low:number; target:number; high:number};
  marketComposite:number;
  benefits:{considered:boolean; estimatedAnnual:number};
  modifiers: Record<string, number>;
}}){
  return (
    <div className="p-4 border rounded-2xl bg-white shadow-sm print-bg">
      <h3 className="text-xl font-semibold mb-2">Reasonable Compensation</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-gray-50"><div className="text-sm text-gray-500">Low</div><div className="text-2xl font-bold"><Currency value={result.range.low}/></div></div>
        <div className="p-3 rounded-xl bg-gray-50"><div className="text-sm text-gray-500">Target</div><div className="text-2xl font-bold"><Currency value={result.range.target}/></div></div>
        <div className="p-3 rounded-xl bg-gray-50"><div className="text-sm text-gray-500">High</div><div className="text-2xl font-bold"><Currency value={result.range.high}/></div></div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Market Composite</div>
          <div className="text-lg font-semibold"><Currency value={result.marketComposite}/></div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Benefits (separate)</div>
          <div className="text-lg font-semibold"><Currency value={result.benefits.estimatedAnnual}/></div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Modifiers</div>
          <div className="text-xs">{Object.entries(result.modifiers).map(([k,v])=> <div key={k}>{k}: {v.toFixed(2)}</div>)}</div>
        </div>
      </div>
    </div>
  );
} 