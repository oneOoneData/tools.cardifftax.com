import { EnhancedDataAggregator } from './dataSources';

export interface DataRefreshStatus {
  lastRefresh: Date | null;
  nextRefresh: Date | null;
  isRefreshing: boolean;
  dataQuality: {
    totalSources: number;
    activeSources: number;
    lastError?: string;
  };
  dataCoverage: {
    states: number;
    roles: number;
    industries: number;
  };
}

export class DataRefreshService {
  private static instance: DataRefreshService;
  private aggregator: EnhancedDataAggregator;
  private refreshInterval: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  private constructor() {
    this.aggregator = new EnhancedDataAggregator();
    this.startAutoRefresh();
  }

  static getInstance(): DataRefreshService {
    if (!DataRefreshService.instance) {
      DataRefreshService.instance = new DataRefreshService();
    }
    return DataRefreshService.instance;
  }

  private startAutoRefresh(): void {
    // Refresh every 24 hours
    const refreshIntervalMs = 24 * 60 * 60 * 1000;
    
    this.refreshInterval = setInterval(async () => {
      await this.refreshData();
    }, refreshIntervalMs);

    // Also refresh on app startup
    this.refreshData();
  }

  async refreshData(): Promise<void> {
    if (this.isRefreshing) {
      return; // Already refreshing
    }

    this.isRefreshing = true;
    
    try {
      await this.aggregator.refreshData();
      console.log('Market data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing market data:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  async forceRefresh(): Promise<void> {
    await this.refreshData();
  }

  getStatus(): DataRefreshStatus {
    const now = new Date();
    const lastRefresh = this.getLastRefreshTime();
    const nextRefresh = lastRefresh ? new Date(lastRefresh.getTime() + 24 * 60 * 60 * 1000) : null;

    return {
      lastRefresh,
      nextRefresh,
      isRefreshing: this.isRefreshing,
      dataQuality: {
        totalSources: 3, // BLS, Salary.com, Industry
        activeSources: this.getActiveSourceCount(),
        lastError: this.getLastError(),
      },
      dataCoverage: {
        states: 10, // Enhanced coverage
        roles: 6,   // All roles covered
        industries: 7, // Industry variations
      },
    };
  }

  private getLastRefreshTime(): Date | null {
    try {
      const stored = localStorage.getItem('marketData');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Date(parsed.lastUpdated);
      }
    } catch (error) {
      console.error('Error getting last refresh time:', error);
    }
    return null;
  }

  private getActiveSourceCount(): number {
    // Count how many data sources are currently available
    let count = 0;
    
    // Salary.com and Industry are always available
    count += 2;
    
    // Check if BLS API key is available
    if (process.env.BLS_API_KEY) {
      count += 1;
    }
    
    return count;
  }

  private getLastError(): string | undefined {
    // This would track the last error from data refresh attempts
    // For now, return undefined
    return undefined;
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Method to get data quality for specific state/role combination
  getDataQuality(state: string, role: string): { confidence: number; lastUpdated: string; sources: string[] } {
    return this.aggregator.getDataQuality(state, role as any);
  }
}

// Export a singleton instance
export const dataRefreshService = DataRefreshService.getInstance(); 