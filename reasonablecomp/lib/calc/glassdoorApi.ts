// Glassdoor API Integration for Live Market Data
// https://www.glassdoor.com/developer/index.htm

import { getGlassdoorData, GlassdoorRequest, GlassdoorResponse } from '../glassdoorData';

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

export class GlassdoorAPIClient {
  constructor() {
    // No API key required - Glassdoor provides free access
  }

  async searchSalaries(
    jobTitle: string,
    location: string,
    limit: number = 10
  ): Promise<GlassdoorJob[]> {
    try {
      // Use client-side function instead of API route
      const request: GlassdoorRequest = {
        jobTitle,
        location,
        limit,
      };
      
      const data: GlassdoorResponse = getGlassdoorData(request);
      
      if (data.success && data.data) {
        return data.data;
      } else {
        console.warn('Glassdoor data returned no results:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error getting Glassdoor data:', error);
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
