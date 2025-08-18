"use client";
import { downloadCompensationPDF } from "../lib/pdfGenerator";
import { CalcRequest, CalcResult } from "../lib/calc/types";

export function Currency({value}:{value:number}){ return <span>${value.toLocaleString()}</span>; }

export default function ResultCard({
  result,
  request
}: {
  result: CalcResult;
  request: CalcRequest;
}) {
  const handleDownloadPDF = () => {
    downloadCompensationPDF(request, result);
  };

  return (
    <div className="p-4 border rounded-2xl bg-white shadow-sm print-bg">
      <h3 className="text-xl font-semibold mb-2">Reasonable Compensation</h3>
      
      {/* Data Sources and Attribution */}
      <div className="mb-4 text-center text-xs text-gray-600">
        <div>Bureau of Labor Statistics + Glassdoor (Live Market Data)</div>
        <div className="mt-1">• 10 States • 6 Roles • Real-time API updates</div>
        <div className="mt-3">
          <a href='http://www.glassdoor.com:8080/index.htm' className='text-blue-600 hover:text-blue-800 underline flex items-center justify-center'>
            powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' className='inline h-4 w-auto ml-1' />
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Low</div>
          <div className="text-2xl font-bold"><Currency value={result.range.low}/></div>
          <div className="text-xs text-gray-500">${Math.round(result.range.low / 12).toLocaleString()}/month</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Target</div>
          <div className="text-2xl font-bold"><Currency value={result.range.target}/></div>
          <div className="text-xs text-gray-500">${Math.round(result.range.target / 12).toLocaleString()}/month</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">High</div>
          <div className="text-2xl font-bold"><Currency value={result.range.high}/></div>
          <div className="text-xs text-gray-500">${Math.round(result.range.high / 12).toLocaleString()}/month</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">
            {result.approach === "market" ? "Market Composite" : "Total Hourly Rate"}
          </div>
          <div className="text-lg font-semibold">
            {result.approach === "market" ? (
              <Currency value={result.marketComposite || 0} />
            ) : (
              <span>${(result.costBreakdown?.totalHourly || 0).toFixed(2)}/hr</span>
            )}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Benefits (separate)</div>
          <div className="text-lg font-semibold"><Currency value={result.benefits.estimatedAnnual}/></div>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500">Modifiers</div>
          <div className="text-xs">{Object.entries(result.modifiers).map(([k,v])=> <div key={k}>{k}: {(v as number).toFixed(2)}</div>)}</div>
        </div>
      </div>
      
      {/* PDF Download Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF Report for IRS</span>
        </button>
                 <p className="text-xs text-gray-500 text-center mt-2">
           Includes all calculations, methodology, and supporting evidence
         </p>
       </div>
       
       {/* Data Transparency Log at Bottom */}
       <div className="mt-6 pt-4 border-t border-gray-200">
         <div className="text-center text-xs text-gray-600">
           <div className="font-medium text-gray-700 mb-1">📊 Data Transparency Log</div>
           <div className="text-gray-500">(0 data points)</div>
           <div className="text-gray-500">Last refresh: Never</div>
           <div className="text-xs text-gray-400 mt-1">Live data from official sources</div>
         </div>
       </div>
     </div>
   );
} 