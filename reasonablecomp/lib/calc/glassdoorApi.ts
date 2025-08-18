// Glassdoor API Integration for Live Market Data
// https://www.glassdoor.com/developer/index.htm

export interface GlassdoorJob {
  jobTitle: string;
  payMedian: number;
  payLow: number;
  payHigh: number;
  payPeriod: string;
  currency: string;
  location: string;
  lastUpdated: string;
}

export interface GlassdoorResponse {
  success: boolean;
  data?: GlassdoorJob[];
  error?: string;
}

export class GlassdoorAPIClient {
  private baseUrl = 'https://api.glassdoor.com/api/api.htm';

  constructor() {
    // No API key required - Glassdoor provides free access
  }

  async searchSalaries(
    jobTitle: string,
    location: string,
    limit: number = 10
  ): Promise<GlassdoorJob[]> {
    try {
      // Note: Glassdoor API requires server-side calls due to CORS restrictions
      // This would need to be implemented as a server-side API route
      const response = await fetch('/api/glassdoor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          location,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Glassdoor API error: ${response.status}`);
      }

      const data: GlassdoorResponse = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        console.warn('Glassdoor API returned no data:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Glassdoor data:', error);
      return [];
    }
  }

  async getSalaryForRole(
    role: string,
    state: string,
    city?: string
  ): Promise<number | null> {
    try {
      // Map role names to proper job titles for Glassdoor
      const roleToJobTitle: Record<string, string> = {
        'exec': 'executive',
        'admin': 'administrative',
        'bookkeeping': 'bookkeeping',
        'sales': 'sales',
        'ops': 'operations',
        'tech': 'technology'
      };
      
      const jobTitle = roleToJobTitle[role] || role;
      const location = city ? `${city}, ${state}` : state;
      
      console.log(`Glassdoor: Fetching salary for ${role} (${jobTitle}) in ${location}`);
      
      const salaries = await this.searchSalaries(jobTitle, location, 5);
      
      console.log(`Glassdoor: Received ${salaries.length} salaries for ${role} in ${location}`);
      
      if (salaries.length > 0) {
        // Return median salary, converted to annual if needed
        const medianSalary = salaries[0].payMedian;
        const annualSalary = this.convertToAnnual(medianSalary, salaries[0].payPeriod);
        console.log(`Glassdoor: Returning salary ${annualSalary} for ${role} in ${location}`);
        return annualSalary;
      }
      
      console.log(`Glassdoor: No salary data found for ${role} in ${location}`);
      return null;
    } catch (error) {
      console.error(`Error getting salary for ${role} in ${state}:`, error);
      return null;
    }
  }

  private convertToAnnual(salary: number, period: string): number {
    switch (period.toLowerCase()) {
      case 'hourly':
        return salary * 40 * 52; // 40 hours/week * 52 weeks
      case 'weekly':
        return salary * 52;
      case 'monthly':
        return salary * 12;
      case 'yearly':
      case 'annual':
        return salary;
      default:
        return salary; // Assume annual
    }
  }

  isAvailable(): boolean {
    return true; // Always available - no API key required
  }
}
