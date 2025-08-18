"use client";

import { useState, useEffect } from 'react';
import { EnhancedDataAggregator } from '../lib/calc/dataSources';

interface DataLogEntry {
  timestamp: string;
  source: string;
  state: string;
  role: string;
  salary: number;
  confidence: number;
  status: 'success' | 'error' | 'pending';
}

interface DataSourceStatus {
  name: string;
  status: 'online' | 'offline' | 'error';
  lastUpdate: string;
  dataPoints: number;
  confidence: number;
}

export default function DataLog() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dataLog, setDataLog] = useState<DataLogEntry[]>([]);
  const [sourceStatus, setSourceStatus] = useState<DataSourceStatus[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isExpanded && typeof window !== 'undefined') {
      generateDataLog().catch(console.error);
    }
  }, [isExpanded]);

  const generateDataLog = async () => {
    const now = new Date();
    const currentTime = now.toISOString();
    
    // Use real data sources instead of fake data
    const dataAggregator = new EnhancedDataAggregator();
    // Limit to fewer states to avoid overwhelming the BLS API
    const states = ['CA', 'NY', 'TX', 'FL', 'IL']; // Reduced from 10 to 5 states
    const roles = ['exec', 'admin', 'bookkeeping', 'sales', 'ops', 'tech'] as const;
    
    const newDataLog: DataLogEntry[] = [];
    const newSourceStatus: DataSourceStatus[] = [];

    try {
      // Refresh data from real sources
      await dataAggregator.refreshData();
      
      // Get real data from the aggregator
      const allData = dataAggregator.getAllData();
      
      if (allData && allData.length > 0) {
        // Use real data from the aggregator
        allData.forEach(dataPoint => {
          newDataLog.push({
            timestamp: dataPoint.lastUpdated,
            source: dataPoint.source,
            state: dataPoint.state,
            role: dataPoint.role,
            salary: dataPoint.salary,
            confidence: dataPoint.confidence,
            status: 'success'
          });
        });
      } else {
        // Show no data available
        newDataLog.push({
          timestamp: currentTime,
          source: 'No Data Available',
          state: 'N/A',
          role: 'N/A',
          salary: 0,
          confidence: 0.0,
          status: 'error'
        });
      }

      // Generate source status from real data
      const realSources = allData.reduce((acc, dataPoint) => {
        if (!acc[dataPoint.source]) {
          acc[dataPoint.source] = { count: 0, confidence: dataPoint.confidence };
        }
        acc[dataPoint.source].count++;
        return acc;
      }, {} as Record<string, { count: number; confidence: number }>);

      Object.entries(realSources).forEach(([sourceName, data]) => {
        newSourceStatus.push({
          name: sourceName,
          status: 'online',
          lastUpdate: currentTime,
          dataPoints: data.count,
          confidence: data.confidence
        });
      });

      // If no real data, show empty status
      if (Object.keys(realSources).length === 0) {
        newSourceStatus.push({
          name: 'No Data Sources Available',
          status: 'offline',
          lastUpdate: currentTime,
          dataPoints: 0,
          confidence: 0.0
        });
      }

      setDataLog(newDataLog);
      setSourceStatus(newSourceStatus);
      setLastRefresh(currentTime);
    } catch (error) {
      console.error('Error fetching real data:', error);
      // Show error status
      setDataLog([{
        timestamp: currentTime,
        source: 'Error Fetching Data',
        state: 'N/A',
        role: 'N/A',
        salary: 0,
        confidence: 0.0,
        status: 'error'
      }]);
      setSourceStatus([{
        name: 'Data Fetch Error',
        status: 'error',
        lastUpdate: currentTime,
        dataPoints: 0,
        confidence: 0.0
      }]);
      setLastRefresh('Error fetching data');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-900/20 border border-green-700/50';
      case 'offline': return 'text-red-400 bg-red-900/20 border border-red-700/50';
      case 'error': return 'text-yellow-400 bg-yellow-900/20 border border-yellow-700/50';
      default: return 'text-gray-400 bg-gray-700/50 border border-gray-600/50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-blue-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="mt-6">
        <div className="w-full p-4 bg-gray-800/70 rounded-lg border border-gray-600/50 backdrop-blur-sm shadow-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="font-medium text-gray-200">📊 Data Transparency Log</span>
              <span className="text-sm text-gray-400">(Loading...)</span>
            </div>
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-800/70 hover:bg-gray-700/60 rounded-lg border border-gray-600/50 transition-colors duration-200 backdrop-blur-sm shadow-custom card-hover"
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-medium text-gray-200">📊 Data Transparency Log</span>
          <span className="text-sm text-gray-400">({dataLog.length} data points)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            Last refresh: {lastRefresh ? formatTimestamp(lastRefresh) : 'Never'}
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 text-gray-400 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Data Source Status */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-600/50 p-4 shadow-custom card-hover">
            <h3 className="text-lg font-semibold text-white mb-4">Data Source Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sourceStatus.map((source, index) => (
                <div key={index} className="p-3 border border-gray-700/50 rounded-lg bg-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{source.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                      {source.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Last Update: {formatTimestamp(source.lastUpdate)}</div>
                    <div>Data Points: {source.dataPoints}</div>
                    <div className={`font-medium ${getConfidenceColor(source.confidence)}`}>
                      Confidence: {(source.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Data Log */}
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-600/50 p-4 shadow-custom card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Data Fetch Log</h3>
              <button
                onClick={() => generateDataLog().catch(console.error)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Refresh Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">State</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salary</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Confidence</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700/30 divide-y divide-gray-700/50">
                  {dataLog.slice(0, 20).map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-700/50">
                      <td className="px-3 py-2 text-xs text-gray-400">{formatTimestamp(entry.timestamp)}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-200">{entry.source}</td>
                      <td className="px-3 py-2 text-xs text-gray-400">{entry.state}</td>
                      <td className="px-3 py-2 text-xs text-gray-400 capitalize">{entry.role}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-200">${entry.salary.toLocaleString()}</td>
                      <td className={`px-3 py-2 text-xs font-medium ${getConfidenceColor(entry.confidence)}`}>
                        {(entry.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'success' ? 'bg-green-900/20 text-green-400 border border-green-700/50' :
                          entry.status === 'error' ? 'bg-red-900/20 text-red-400 border border-red-700/50' :
                          'bg-yellow-900/20 text-yellow-400 border border-yellow-700/50'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {dataLog.length > 20 && (
              <div className="mt-3 text-center text-sm text-gray-400">
                Showing 20 of {dataLog.length} entries. All data is publicly available and automatically updated.
              </div>
            )}
          </div>

          {/* Data Quality Summary */}
          <div className="bg-blue-900/30 rounded-lg border border-blue-600/50 p-4 shadow-custom card-hover">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">Data Quality Assurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-300">
              <div>
                <div className="font-medium mb-2">✅ Public Data Sources:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Bureau of Labor Statistics - Official US Government</li>
                  <li>• Glassdoor - Market-based salary data • <a href='http://www.glassdoor.com:8080/index.htm' className='text-blue-300 hover:text-blue-200 underline'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' className='inline h-4 w-auto ml-1' /></a></li>
                  <li>• Industry surveys and benchmarks</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">🔄 Always Current:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Real-time API calls to public sources</li>
                  <li>• 24-hour automatic refresh cycle</li>
                  <li>• Timestamped data with source verification</li>
                  <li>• Rate-limited to respect API provider limits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 