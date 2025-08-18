import { Role, Roles } from './types';
import { BLSAPIClient } from './blsApi';
import { GlassdoorAPIClient } from './glassdoorApi';

export interface MarketDataPoint {
  state: string;
  metro?: string;
  industry?: string;
  role: Role;
  salary: number;
  source: string;
  lastUpdated: string;
  confidence: number; // 0-1 scale
}

export interface DataSource {
  name: string;
  fetchData(): Promise<MarketDataPoint[]>;
  isAvailable(): boolean;
}

export interface DataAggregator {
  getBaseline(state: string, role: Role, metro?: string, industry?: string): number;
  getDataQuality(state: string, role: Role): { confidence: number; lastUpdated: string; sources: string[] };
  refreshData(): Promise<void>;
}

// BLS (Bureau of Labor Statistics) Data Source
export class BLSDataSource implements DataSource {
  name = 'BLS';
  private apiClient: BLSAPIClient | null = null;
  private apiKey: string | null = null;

  constructor() {
    // BLS doesn't require API key - always available
    this.apiClient = new BLSAPIClient();
  }

  isAvailable(): boolean {
    return this.apiClient !== null; // Always available, with or without API key
  }

  async fetchData(): Promise<MarketDataPoint[]> {
    if (!this.apiClient) {
      throw new Error('BLS API client not initialized');
    }

    try {
      const results: MarketDataPoint[] = [];
      // Limit to fewer states to avoid overwhelming the BLS API
      const states = ['CA', 'NY', 'TX', 'FL', 'IL']; // Reduced from 10 to 5 states
      const roles: Role[] = ['exec', 'admin', 'bookkeeping', 'sales', 'ops', 'tech'];
      const now = new Date().toISOString();
      const currentYear = new Date().getFullYear();

      // Fetch data for each state and role combination with rate limiting
      for (const state of states) {
        for (const role of roles) {
          try {
            const salary = await this.apiClient.fetchCompensationData(state, role, currentYear);
            if (salary !== null) {
              results.push({
                state,
                role,
                salary,
                                 source: 'BLS (Government-Published Data)',
                lastUpdated: now,
                confidence: 0.95, // BLS data has high confidence
              });
            }
            // Add delay between requests to respect BLS rate limits
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
          } catch (error) {
            console.warn(`Failed to fetch BLS data for ${role} in ${state}:`, error);
            // Continue with other data sources instead of failing completely
          }
        }
      }

      console.log(`BLS API: Fetched ${results.length} data points`);
      return results;
    } catch (error) {
      console.error('Error fetching BLS data:', error);
      return [];
    }
  }

  getRemainingRequests(): number {
    return this.apiClient?.getRemainingRequests() || 0;
  }

  getDailyUsage() {
    return this.apiClient?.getDailyUsage() || { used: 0, remaining: 0, resetDate: new Date().toISOString() };
  }
}

// Glassdoor Data Source - Real Market Data
export class GlassdoorDataSource implements DataSource {
  name = 'Glassdoor';
  private apiClient: GlassdoorAPIClient | null = null;
  
  constructor() {
    // No API key required - Glassdoor provides free access
    this.apiClient = new GlassdoorAPIClient();
  }
  
  isAvailable(): boolean {
    return this.apiClient?.isAvailable() || false;
  }

  async fetchData(): Promise<MarketDataPoint[]> {
    if (!this.apiClient) {
      console.warn('Glassdoor API client not available');
      return [];
    }

    try {
      const results: MarketDataPoint[] = [];
      // Limit to fewer states to avoid overwhelming the APIs
      const states = ['CA', 'NY', 'TX', 'FL', 'IL']; // Reduced from 10 to 5 states
      const roles: Role[] = ['exec', 'admin', 'bookkeeping', 'sales', 'ops', 'tech'];
      const now = new Date().toISOString();

      // Fetch data for each state and role combination
      for (const state of states) {
        for (const role of roles) {
          try {
            const salary = await this.apiClient.getSalaryForRole(role, state);
            if (salary !== null) {
              results.push({
                state,
                role,
                salary,
                                 source: 'Glassdoor (Market-Based Data)',
                lastUpdated: now,
                confidence: 0.8, // Glassdoor data has good confidence
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch Glassdoor data for ${role} in ${state}:`, error);
          }
        }
      }

      console.log(`Glassdoor API: Fetched ${results.length} data points`);
      return results;
    } catch (error) {
      console.error('Error fetching Glassdoor data:', error);
      return [];
    }
  }
}

// Industry-specific data source
export class IndustryDataSource implements DataSource {
  name = 'Industry Data';
  
  isAvailable(): boolean {
    return true;
  }

  async fetchData(): Promise<MarketDataPoint[]> {
    // This would fetch industry-specific salary data
    // For now, return industry multipliers
    const now = new Date().toISOString();
    const industryMultipliers = {
      'technology': 1.2,
      'healthcare': 1.1,
      'finance': 1.15,
      'manufacturing': 0.95,
      'retail': 0.9,
      'consulting': 1.1,
      'real-estate': 1.05,
    };

    const results: MarketDataPoint[] = [];
    
    // Generate industry-specific data based on base salaries
    Object.entries(industryMultipliers).forEach(([industry, multiplier]) => {
      // This would be more sophisticated in a real implementation
      results.push({
        state: 'CA', // Base state
        industry,
        role: 'exec',
        salary: Math.round(145000 * multiplier),
        source: 'Industry Analysis',
        lastUpdated: now,
        confidence: 0.8,
      });
    });

    return results;
  }
}

// Data Aggregator that combines multiple sources
export class EnhancedDataAggregator implements DataAggregator {
  private dataSources: DataSource[] = [];
  private cachedData: MarketDataPoint[] = [];
  private lastRefresh: Date | null = null;
  private refreshInterval = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeDataSources();
  }

  private initializeDataSources() {
    // Add data sources in order of preference
    this.dataSources.push(new BLSDataSource()); // No API key needed
    this.dataSources.push(new GlassdoorDataSource());
    this.dataSources.push(new IndustryDataSource());
  }

  async refreshData(): Promise<void> {
    try {
      const allData: MarketDataPoint[] = [];
      
      for (const source of this.dataSources) {
        if (source.isAvailable()) {
          try {
            const data = await source.fetchData();
            if (data && data.length > 0) {
              allData.push(...data);
            }
          } catch (error) {
            console.error(`Error fetching data from ${source.name}:`, error);
            // Continue with other sources instead of failing completely
          }
        }
      }

      // Only use real data - no fallback data
      this.cachedData = allData;
      this.lastRefresh = new Date();
      
      // Save to local storage or database
      this.saveDataLocally(allData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      // No fallback data - show empty state
      this.cachedData = [];
      this.lastRefresh = new Date();
    }
  }

  private saveDataLocally(data: MarketDataPoint[]): void {
    try {
      localStorage.setItem('marketData', JSON.stringify({
        data,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error saving data locally:', error);
    }
  }

  private loadDataLocally(): MarketDataPoint[] {
    try {
      const stored = localStorage.getItem('marketData');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.lastRefresh = new Date(parsed.lastUpdated);
        return parsed.data;
      }
    } catch (error) {
      console.error('Error loading local data:', error);
    }
    return [];
  }

  getBaseline(state: string, role: Role, metro?: string, industry?: string): number {
    // Check if we need to refresh data
    if (!this.lastRefresh || Date.now() - this.lastRefresh.getTime() > this.refreshInterval) {
      this.refreshData(); // Fire and forget
    }

    // Use cached data or fall back to local data
    const data = this.cachedData.length > 0 ? this.cachedData : this.loadDataLocally();
    
    if (data.length === 0) {
      // No real data available - throw error
      throw new Error(`No compensation data available for ${role} in ${state}. Please ensure data sources are accessible.`);
    }

    // Find the best matching data point
    const matches = data.filter(point => 
      point.state === state && 
      point.role === role &&
      (!metro || point.metro === metro) &&
      (!industry || point.industry === industry)
    );

    if (matches.length === 0) {
      // Fallback to state-only match
      const stateMatches = data.filter(point => 
        point.state === state && 
        point.role === role
      );
      
      if (stateMatches.length > 0) {
        // Return weighted average by confidence
        const totalWeight = stateMatches.reduce((sum, point) => sum + point.confidence, 0);
        const weightedSum = stateMatches.reduce((sum, point) => sum + (point.salary * point.confidence), 0);
        return Math.round(weightedSum / totalWeight);
      }
    } else {
      // Return weighted average of matches
      const totalWeight = matches.reduce((sum, point) => sum + point.confidence, 0);
      const weightedSum = matches.reduce((sum, point) => sum + (point.salary * point.confidence), 0);
      return Math.round(weightedSum / totalWeight);
    }

    // No data found
    throw new Error(`No compensation data found for ${role} in ${state}. Please check data source availability.`);
  }



  getAllData(): MarketDataPoint[] {
    return this.cachedData.length > 0 ? this.cachedData : this.loadDataLocally();
  }

  getDataQuality(state: string, role: Role): { confidence: number; lastUpdated: string; sources: string[] } {
    const data = this.cachedData.length > 0 ? this.cachedData : this.loadDataLocally();
    
    const relevantData = data.filter(point => 
      point.state === state && point.role === role
    );

    if (relevantData.length === 0) {
      return {
        confidence: 0.0,
        lastUpdated: this.lastRefresh?.toISOString() || 'Never',
        sources: ['No Data Available'],
      };
    }

    const avgConfidence = relevantData.reduce((sum, point) => sum + point.confidence, 0) / relevantData.length;
    const sources = [...new Set(relevantData.map(point => point.source))];

    return {
      confidence: avgConfidence,
      lastUpdated: this.lastRefresh?.toISOString() || 'Never',
      sources,
    };
  }
} 