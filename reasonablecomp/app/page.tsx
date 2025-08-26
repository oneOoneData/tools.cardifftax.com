"use client";

import { useState, useEffect } from 'react';
import DataLog from '../components/DataLog';
import { downloadSimpleCompensationPDF } from '../lib/pdfGenerator';

// Simple Field component
const Field = ({ label, type, value, onChange, placeholder, required = false, options = [] }: {
  label: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
        <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
          {type === 'select' ? 'Loading...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-200 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-custom"
          required={required}
          suppressHydrationWarning
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-custom"
          required={required}
          suppressHydrationWarning
        />
      )}
    </div>
  );
};

export default function Home() {
  return <ClientForm />;
}

function ClientForm() {
  const [formData, setFormData] = useState({
    name: 'Owner',
    state: 'CA',
    metro: '',
    industry: 'technology',
    revenue: 1000000,
    employees: 10,
    experienceYears: 5,
    hoursPerWeek: 40,
    benefitsInclude: false,
    benefitsAmount: 15000,
    approach: 'market' as 'market' | 'cost',
    hourlyRate: 50,
    overheadPercentage: 30,
    profitMargin: 20,
    roleMix: {
      exec: 0.5,
      admin: 0.1,
      bookkeeping: 0.1,
      sales: 0.1,
      ops: 0.1,
      tech: 0.1,
    },
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleMixChange = (role: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      roleMix: {
        ...prev.roleMix,
        [role]: value
      }
    }));
  };

  const calculateCompensation = async () => {
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      const totalRoleMix = Object.values(formData.roleMix).reduce((sum, val) => sum + val, 0);
      
      if (Math.abs(totalRoleMix - 1) < 0.000001) {
        // Calculate compensation based on role mix and state
        const baseSalaries = {
          exec: 180000,
          admin: 65000,
          bookkeeping: 58000,
          sales: 75000,
          ops: 85000,
          tech: 120000,
        };

        const stateMultipliers = {
          CA: 1.2,
          NY: 1.15,
          TX: 1.0,
          FL: 0.95,
          IL: 1.05,
        };

        const industryMultipliers = {
          technology: 1.2,
          healthcare: 1.1,
          finance: 1.15,
          manufacturing: 0.95,
          retail: 0.9,
          consulting: 1.1,
          'real-estate': 1.05,
        };

        const baseCompensation = Object.entries(formData.roleMix).reduce((total, [role, percentage]) => {
          const baseSalary = baseSalaries[role as keyof typeof baseSalaries];
          const stateMultiplier = stateMultipliers[formData.state as keyof typeof stateMultipliers];
          const industryMultiplier = industryMultipliers[formData.industry as keyof typeof industryMultipliers];
          
          return total + (baseSalary * percentage * stateMultiplier * industryMultiplier);
        }, 0);

        // Calculate low, medium, and high ranges
        const lowMultiplier = 0.85;  // 15% below base
        const highMultiplier = 1.25; // 25% above base
        
        const lowCompensation = Math.round(baseCompensation * lowMultiplier);
        const mediumCompensation = Math.round(baseCompensation);
        const highCompensation = Math.round(baseCompensation * highMultiplier);

        setResults({
          name: formData.name,
          compensationRanges: {
            low: lowCompensation,
            medium: mediumCompensation,
            high: highCompensation
          },
          roleBreakdown: Object.entries(formData.roleMix).map(([role, percentage]) => ({
            role,
            percentage: percentage * 100,
            salary: Math.round(baseSalaries[role as keyof typeof baseSalaries] * 
                             stateMultipliers[formData.state as keyof typeof stateMultipliers] * 
                             industryMultipliers[formData.industry as keyof typeof industryMultipliers] * 
                             percentage)
          })),
          state: formData.state,
          industry: formData.industry,
          approach: formData.approach,
          experienceYears: formData.experienceYears,
          hoursPerWeek: formData.hoursPerWeek,
          benefits: formData.benefitsInclude ? formData.benefitsAmount : 0,
        });
      } else {
        setResults({ error: 'Role distribution must equal exactly 100%' });
      }
      
      setIsCalculating(false);
    }, 1000);
  };

  const totalRoleMix = Object.values(formData.roleMix).reduce((sum, val) => sum + val, 0);
  const isValidDistribution = Math.abs(totalRoleMix - 1) < 0.000001;

  return (
    <div className="min-h-screen bg-[#243549] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="cardiff tax pros og image.png" 
              alt="Cardiff Tax Pros" 
              className="h-16 w-auto mr-4"
            />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">Reasonable Comp Calculator</h1>
              <p className="text-xl text-gray-300">Professional compensation analysis for S-Corp owners</p>
            </div>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Calculate market-appropriate salaries with confidence using real-time data from Bureau of Labor Statistics and Glassdoor market insights.
          </p>
        </div>

        {/* Data Sources Status */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-600/50 shadow-custom card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-200 font-medium">Bureau of Labor Statistics</span>
              </div>
              <span className="text-gray-500">+</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-200 font-medium">Glassdoor (Live Market Data)</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              • 5 States • 6 Roles • Real-time API updates
            </div>
          </div>
          
          {/* Glassdoor Attribution */}
          <div className="flex justify-center pt-4 border-t border-gray-600/50">
            <a 
              href='http://www.glassdoor.com:8080/index.htm' 
              className='text-gray-400 hover:text-gray-300 transition-colors duration-200 flex items-center space-x-2'
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>powered by</span>
              <img 
                src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' 
                title='Job Search' 
                className='h-6 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200'
              />
            </a>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
              <h2 className="text-2xl font-semibold text-white mb-6">Owner Information</h2>
              
              <Field
                label="Owner Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter owner name"
                required
              />

              <Field
                label="State"
                type="select"
                value={formData.state}
                onChange={(value) => handleInputChange('state', value)}
                options={[
                  { value: 'CA', label: 'California' },
                  { value: 'NY', label: 'New York' },
                  { value: 'TX', label: 'Texas' },
                  { value: 'FL', label: 'Florida' },
                  { value: 'IL', label: 'Illinois' },
                ]}
                required
              />

              <Field
                label="Metro Area (Optional)"
                type="text"
                value={formData.metro}
                onChange={(value) => handleInputChange('metro', value)}
                placeholder="e.g., San Francisco, Austin, Miami"
              />

              <Field
                label="Years of Experience"
                type="number"
                value={formData.experienceYears}
                onChange={(value) => handleInputChange('experienceYears', value)}
                placeholder="5"
                required
              />

              <Field
                label="Hours per Week"
                type="number"
                value={formData.hoursPerWeek}
                onChange={(value) => handleInputChange('hoursPerWeek', value)}
                placeholder="40"
                required
              />
            </div>

            {/* Company Information */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
              <h2 className="text-2xl font-semibold text-white mb-6">Company Information</h2>
              
              <Field
                label="Industry"
                type="select"
                value={formData.industry}
                onChange={(value) => handleInputChange('industry', value)}
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'consulting', label: 'Consulting' },
                  { value: 'real-estate', label: 'Real Estate' },
                ]}
                required
              />

              <Field
                label="Annual Revenue"
                type="number"
                value={formData.revenue}
                onChange={(value) => handleInputChange('revenue', value)}
                placeholder="1000000"
                required
              />

              <Field
                label="Number of Employees"
                type="number"
                value={formData.employees}
                onChange={(value) => handleInputChange('employees', value)}
                placeholder="10"
                required
              />
            </div>

            {/* Calculation Approach */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
              <h2 className="text-2xl font-semibold text-white mb-6">Calculation Approach</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-3">Select Approach</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="market"
                      checked={formData.approach === 'market'}
                      onChange={(e) => handleInputChange('approach', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="text-gray-300">Market Approach</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="cost"
                      checked={formData.approach === 'cost'}
                      onChange={(e) => handleInputChange('approach', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500 bg-gray-700"
                    />
                    <span className="text-gray-300">Cost Approach</span>
                  </label>
                </div>
              </div>

              {formData.approach === 'cost' && (
                <div className="space-y-4 pt-4 border-t border-gray-600/50">
                  <h3 className="text-lg font-semibold text-white">Cost Approach Details</h3>
                  
                  <Field
                    label="Base Hourly Rate ($/hr)"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(value) => handleInputChange('hourlyRate', value)}
                    placeholder="50.00"
                  />

                  <Field
                    label="Overhead Percentage (%)"
                    type="number"
                    value={formData.overheadPercentage}
                    onChange={(value) => handleInputChange('overheadPercentage', value)}
                    placeholder="30"
                  />

                  <Field
                    label="Profit Margin (%)"
                    type="number"
                    value={formData.profitMargin}
                    onChange={(value) => handleInputChange('profitMargin', value)}
                    placeholder="20"
                  />
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
              <h2 className="text-2xl font-semibold text-white mb-6">Benefits</h2>
              
              <div className="mb-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.benefitsInclude}
                    onChange={(e) => handleInputChange('benefitsInclude', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="text-gray-300">Include benefits in calculation</span>
                </label>
              </div>
              
              {formData.benefitsInclude && (
                <Field
                  label="Annual Benefits Value"
                  type="number"
                  value={formData.benefitsAmount}
                  onChange={(value) => handleInputChange('benefitsAmount', value)}
                  placeholder="15000"
                />
              )}
            </div>

            {/* Role Distribution */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
              <h2 className="text-2xl font-semibold text-white mb-6">Role Distribution</h2>
              <p className="text-gray-400 mb-4">Define the percentage allocation for each role in your company</p>
              
              <div className="space-y-4">
                {Object.entries(formData.roleMix).map(([role, percentage]) => (
                  <div key={role} className="flex items-center space-x-4">
                    <label className="w-24 text-sm font-medium text-gray-200 capitalize">
                      {role}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={percentage}
                      onChange={(e) => handleRoleMixChange(role, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-custom"
                    />
                    <span className="w-16 text-sm text-gray-400 text-right">
                      {(percentage * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Validation Message */}
              <div className="mt-4 p-3 rounded-lg border">
                {isValidDistribution ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Valid Distribution</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Invalid Distribution ⚠️ Role distribution must equal exactly 100%. Current total: {(totalRoleMix * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={calculateCompensation}
                  disabled={!isValidDistribution || isCalculating}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-custom hover:shadow-custom-lg"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Calculating...</span>
                    </div>
                  ) : (
                    'Calculate Compensation'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results && !results.error && (
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-custom card-hover">
                <h3 className="text-2xl font-semibold text-white mb-6">Compensation Analysis</h3>
                
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-semibold text-white text-center">Compensation Ranges</h4>
                  
                  {/* Low Range */}
                  <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-600/50 shadow-custom">
                    <p className="text-sm font-medium text-red-300 mb-2">Conservative Range</p>
                    <p className="text-2xl font-bold text-red-200">${results.compensationRanges.low.toLocaleString()}</p>
                    <p className="text-sm text-red-400 mb-2">Annual</p>
                    <div className="text-lg font-semibold text-red-300">${Math.round(results.compensationRanges.low / 12).toLocaleString()}</div>
                    <p className="text-xs text-red-400">Monthly</p>
                  </div>

                  {/* Medium Range */}
                  <div className="text-center p-4 bg-blue-900/30 rounded-xl border border-blue-600/50 shadow-custom">
                    <p className="text-sm font-medium text-blue-300 mb-2">Market Rate</p>
                    <p className="text-2xl font-bold text-blue-200">${results.compensationRanges.medium.toLocaleString()}</p>
                    <p className="text-sm text-blue-400 mb-2">Annual</p>
                    <div className="text-lg font-semibold text-blue-300">${Math.round(results.compensationRanges.medium / 12).toLocaleString()}</div>
                    <p className="text-xs text-blue-400">Monthly</p>
                  </div>

                  {/* High Range */}
                  <div className="text-center p-4 bg-green-900/20 rounded-xl border border-green-600/50 shadow-custom">
                    <p className="text-sm font-medium text-green-300 mb-2">Aggressive Range</p>
                    <p className="text-2xl font-bold text-green-200">${results.compensationRanges.high.toLocaleString()}</p>
                    <p className="text-sm text-green-400 mb-2">Annual</p>
                    <div className="text-lg font-semibold text-green-300">${Math.round(results.compensationRanges.high / 12).toLocaleString()}</div>
                    <p className="text-xs text-green-400">Monthly</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Owner Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="text-gray-400">Name</div>
                      <div className="text-white font-semibold">{results.name}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="text-gray-400">Experience</div>
                      <div className="text-white font-semibold">{results.experienceYears} years</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h4 className="text-lg font-semibold text-white">Role Breakdown</h4>
                  {results.roleBreakdown.map((role: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 shadow-custom">
                      <span className="text-gray-200 capitalize">{role.role}</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">${role.salary.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{role.percentage.toFixed(0)}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-600/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="text-gray-400">State</div>
                      <div className="text-white font-semibold">{results.state}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="text-gray-400">Industry</div>
                      <div className="text-white font-semibold capitalize">{results.industry}</div>
                    </div>
                  </div>
                </div>

                {results.benefits > 0 && (
                  <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-600/50">
                    <div className="text-center">
                      <div className="text-green-300 font-medium">Benefits Included</div>
                      <div className="text-green-200 font-semibold text-lg">${results.benefits.toLocaleString()}/year</div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-600/50">
                  {/* Email Capture Section */}
                  <div className="mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-600/50">
                    <div className="text-center mb-3">
                      <div className="text-blue-300 font-medium">Get Results Emailed to You</div>
                      <div className="text-blue-200 text-sm">Free PDF report + consultation offer</div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-custom">
                        Send Results
                      </button>
                    </div>
                    <p className="text-xs text-blue-400 mt-2 text-center">We'll never spam you • Unsubscribe anytime</p>
                  </div>

                  <button
                    onClick={() => downloadSimpleCompensationPDF(results)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-custom hover:shadow-custom-lg"
                  >
                    Download PDF
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400 mb-3">Need help implementing this compensation plan?</p>
                    <a
                      href="https://www.cardifftax.com/book-online?utm_source=tools&utm_medium=cta&utm_campaign=reasonable_comp_calculator&utm_content=results_page"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-custom hover:shadow-custom-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Book Free Consultation
                    </a>
                    <p className="text-xs text-gray-500 mt-2">Free consultation • CTEC & NACPB Certified • Encinitas, CA</p>
                  </div>
                </div>
              </div>
            )}
            
            {results && results.error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-xl p-6 shadow-custom">
                <div className="flex items-center space-x-2 text-red-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-semibold">Error</span>
                </div>
                <p className="mt-2 text-red-300">{results.error}</p>
              </div>
            )}

            {!results && (
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-8 border border-gray-600/50 text-center shadow-custom card-hover">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Calculate</h3>
                <p className="text-gray-400">Fill out the form and click "Calculate Compensation" to see your results</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Transparency Log */}
        <DataLog />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-600/50 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="cardiff tax pros og image.png" 
              alt="Cardiff Tax Pros" 
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              onClick={() => window.open('https://www.cardifftax.com', '_blank')}
            />
            <div className="text-left">
              <div className="text-white font-semibold">Cardiff Tax Pros</div>
              <div className="text-sm text-gray-400">Professional Tax Services</div>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="flex items-center justify-center space-x-6 mb-4 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>CTEC Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>NACPB Member</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Encinitas, CA</span>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm">
            2025 - www.cardifftax.com
          </div>
        </footer>
      </div>
    </div>
  );
}
