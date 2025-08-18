import { CalcRequestSchema, type CalcRequest, type CalcResult } from "./types";
import { buildModifiers } from "./modifiers";
import { EnhancedDataAggregator } from "./dataSources";

// Use the enhanced data aggregator instead of static JSON
const dataAggregator = new EnhancedDataAggregator();

export function computeComp(raw: CalcRequest): CalcResult {
  const input = CalcRequestSchema.parse(raw);
  
  if (input.approach === "cost") {
    return computeCostApproach(input);
  } else {
    return computeMarketApproach(input);
  }
}

function computeMarketApproach(input: CalcRequest): CalcResult {
  // Use enhanced data aggregator for market data
  const mc = (Object.entries(input.roleMix) as [string, number][])
    .reduce((sum, [role, share]) => {
      const baseline = dataAggregator.getBaseline(
        input.client.state, 
        role as any, 
        input.client.metro, 
        input.client.industryLabel
      );
      return sum + baseline * share;
    }, 0);
    
  const mods = buildModifiers(input);
  const prod = mods.experience * mods.companySize * mods.revenueSignal * mods.hoursNorm;
  const target = mc * prod;
  
  // Get data quality information for notes
  const dataQuality = dataAggregator.getDataQuality(input.client.state, 'exec');
  
  return {
    approach: "market",
    marketComposite: Math.round(mc),
    modifiers: mods,
    target: Math.round(target),
    range: { low: Math.round(target*0.90), target: Math.round(target), high: Math.round(target*1.15) },
    benefits: { considered: input.benefits.include, estimatedAnnual: input.benefits.estimatedAnnual ?? 0 },
    notes: [
      "Market approach: Based on enhanced market data from multiple sources",
      `Data sources: ${dataQuality.sources.join(', ')}`,
      `Data confidence: ${(dataQuality.confidence * 100).toFixed(0)}%`,
      `Last updated: ${new Date(dataQuality.lastUpdated).toLocaleDateString()}`,
      "Role mix must sum to 1.0",
      "Bands: Low −10%, High +15%",
      "Benefits shown separately"
    ]
  };
}

function computeCostApproach(input: CalcRequest): CalcResult {
  if (!input.costApproach) {
    throw new Error("Cost approach data is required for cost-based calculation");
  }
  
  const { hourlyRate, overheadPercentage, profitMargin } = input.costApproach;
  const hoursPerYear = input.owner.hoursPerWeek * 52;
  
  // Calculate cost components
  const baseHourly = hourlyRate;
  const overhead = baseHourly * (overheadPercentage / 100);
  const profit = baseHourly * (profitMargin / 100);
  const totalHourly = baseHourly + overhead + profit;
  
  // Apply modifiers for experience and company factors
  const mods = buildModifiers(input);
  const adjustedHourly = totalHourly * mods.experience * mods.companySize;
  
  const target = Math.round(adjustedHourly * hoursPerYear);
  
  return {
    approach: "cost",
    costBreakdown: {
      baseHourly: Math.round(baseHourly * 100) / 100,
      overhead: Math.round(overhead * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      totalHourly: Math.round(totalHourly * 100) / 100
    },
    modifiers: mods,
    target: target,
    range: { 
      low: Math.round(target * 0.90), 
      target: target, 
      high: Math.round(target * 1.15) 
    },
    benefits: { considered: input.benefits.include, estimatedAnnual: input.benefits.estimatedAnnual ?? 0 },
    notes: [
      "Cost approach: Based on actual costs plus overhead and profit",
      `Base hourly rate: $${hourlyRate}/hr`,
      `Overhead: ${overheadPercentage}% of base rate`,
      `Profit margin: ${profitMargin}% of base rate`,
      `Total hourly: $${totalHourly.toFixed(2)}/hr`,
      `Annual hours: ${hoursPerYear} hours`,
      "Bands: Low −10%, High +15%",
      "Benefits shown separately"
    ]
  };
} 