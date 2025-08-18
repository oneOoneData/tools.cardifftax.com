import { NextRequest, NextResponse } from 'next/server';

interface GlassdoorRequest {
  jobTitle: string;
  location: string;
  limit: number;
}

interface GlassdoorResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

// Market-based salary ranges for different roles and states
const MARKET_SALARIES = {
  exec: {
    CA: { median: 180000, low: 150000, high: 250000 },
    NY: { median: 190000, low: 160000, high: 270000 },
    TX: { median: 160000, low: 130000, high: 220000 },
    FL: { median: 150000, low: 120000, high: 200000 },
    IL: { median: 170000, low: 140000, high: 230000 }
  },
  admin: {
    CA: { median: 65000, low: 55000, high: 80000 },
    NY: { median: 70000, low: 60000, high: 85000 },
    TX: { median: 58000, low: 48000, high: 72000 },
    FL: { median: 55000, low: 45000, high: 68000 },
    IL: { median: 62000, low: 52000, high: 75000 }
  },
  bookkeeping: {
    CA: { median: 58000, low: 48000, high: 72000 },
    NY: { median: 62000, low: 52000, high: 78000 },
    TX: { median: 52000, low: 42000, high: 65000 },
    FL: { median: 50000, low: 40000, high: 62000 },
    IL: { median: 55000, low: 45000, high: 68000 }
  },
  sales: {
    CA: { median: 75000, low: 60000, high: 95000 },
    NY: { median: 80000, low: 65000, high: 100000 },
    TX: { median: 68000, low: 55000, high: 85000 },
    FL: { median: 65000, low: 52000, high: 82000 },
    IL: { median: 72000, low: 58000, high: 90000 }
  },
  ops: {
    CA: { median: 85000, low: 70000, high: 110000 },
    NY: { median: 90000, low: 75000, high: 120000 },
    TX: { median: 78000, low: 65000, high: 100000 },
    FL: { median: 75000, low: 62000, high: 95000 },
    IL: { median: 82000, low: 68000, high: 105000 }
  },
  tech: {
    CA: { median: 120000, low: 95000, high: 160000 },
    NY: { median: 130000, low: 105000, high: 170000 },
    TX: { median: 110000, low: 88000, high: 140000 },
    FL: { median: 105000, low: 83000, high: 135000 },
    IL: { median: 115000, low: 92000, high: 150000 }
  }
};

export async function POST(request: NextRequest): Promise<NextResponse<GlassdoorResponse>> {
  try {
    const body: GlassdoorRequest = await request.json();
    const { jobTitle, location, limit } = body;

    console.log(`Glassdoor API: Received request for ${jobTitle} in ${location}`);

    // Validate inputs
    if (!jobTitle || !location) {
      console.log(`Glassdoor API: Missing required fields - jobTitle: ${jobTitle}, location: ${location}`);
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: jobTitle, location'
      }, { status: 400 });
    }

    // Map job titles to our role categories
    const roleMap: Record<string, keyof typeof MARKET_SALARIES> = {
      'executive': 'exec',
      'exec': 'exec',
      'management': 'exec',
      'administrative': 'admin',
      'admin': 'admin',
      'office': 'admin',
      'bookkeeping': 'bookkeeping',
      'accounting': 'bookkeeping',
      'sales': 'sales',
      'operations': 'ops',
      'ops': 'ops',
      'business': 'ops',
      'technology': 'tech',
      'tech': 'tech',
      'software': 'tech',
      'developer': 'tech'
    };

    // Find the best matching role - check for exact matches first, then partial matches
    let roleKey: keyof typeof MARKET_SALARIES = 'admin'; // default
    
    // First try exact match
    if (roleMap[jobTitle.toLowerCase()]) {
      roleKey = roleMap[jobTitle.toLowerCase()];
      console.log(`Glassdoor API: Exact match found for ${jobTitle} -> ${roleKey}`);
    } else {
      // Then try partial matches
      for (const [key, role] of Object.entries(roleMap)) {
        if (jobTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(jobTitle.toLowerCase())) {
          roleKey = role;
          console.log(`Glassdoor API: Partial match found for ${jobTitle} -> ${key} -> ${roleKey}`);
          break;
        }
      }
    }

    console.log(`Glassdoor API: Using role key: ${roleKey} for job title: ${jobTitle}`);

    const stateData = MARKET_SALARIES[roleKey][location as keyof typeof MARKET_SALARIES[typeof roleKey]] || 
                     MARKET_SALARIES[roleKey].CA; // Default to CA if state not found

    console.log(`Glassdoor API: State data for ${roleKey} in ${location}:`, stateData);

    // Add some realistic variation to the data
    const variation = 0.15; // 15% variation
    const baseSalary = stateData.median;
    const salaryVariation = baseSalary * variation;
    
    const jobs = Array.from({ length: Math.min(limit, 10) }, (_, i) => {
      const randomVariation = (Math.random() - 0.5) * 2 * salaryVariation;
      const adjustedSalary = Math.round(baseSalary + randomVariation);
      
      return {
        jobTitle: jobTitle,
        payMedian: adjustedSalary,
        payLow: Math.round(adjustedSalary * 0.8),
        payHigh: Math.round(adjustedSalary * 1.2),
        payPeriod: 'yearly',
        currency: 'USD',
        location: location,
        lastUpdated: new Date().toISOString(),
        source: 'Glassdoor Market Data (Simulated)'
      };
    });

    return NextResponse.json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error('Glassdoor API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Glassdoor Market Data API endpoint - use POST with jobTitle and location',
    note: 'Provides realistic market-based salary data with required Glassdoor attribution'
  });
}
