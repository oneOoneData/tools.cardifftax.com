# Enhanced Market Data System

## Overview
The S-Corp Compensation Calculator now features an enhanced market data system that automatically fetches and updates compensation data from multiple sources, ensuring your calculations are always current and comprehensive.

## Data Sources

### 1. Bureau of Labor Statistics (BLS)
- **Source**: Official government data
- **Coverage**: National and state-level occupational employment statistics
- **Update Frequency**: Quarterly
- **Setup**: Requires free API key from https://www.bls.gov/developers/

### 2. Enhanced Static Data
- **Source**: Curated market research data
- **Coverage**: 10 states with comprehensive role coverage
- **Update Frequency**: Manual updates as needed
- **Reliability**: High confidence (85%)

### 3. Industry-Specific Data
- **Source**: Industry analysis and multipliers
- **Coverage**: 7 major industries
- **Industries**: Technology, Healthcare, Finance, Manufacturing, Retail, Consulting, Real Estate
- **Method**: Industry-specific salary adjustments

## Enhanced Coverage

### States Supported
- California (CA)
- New York (NY)
- Texas (TX)
- Florida (FL)
- Illinois (IL)
- Washington (WA)
- Colorado (CO)
- Georgia (GA)
- North Carolina (NC)
- Virginia (VA)

### Roles Covered
- Executive (exec)
- Administrative (admin)
- Bookkeeping (bookkeeping)
- Sales (sales)
- Operations (ops)
- Technology (tech)

### Industries Supported
- Technology (1.2x multiplier)
- Healthcare (1.1x multiplier)
- Finance (1.15x multiplier)
- Manufacturing (0.95x multiplier)
- Retail (0.9x multiplier)
- Consulting (1.1x multiplier)
- Real Estate (1.05x multiplier)

## Features

### Automatic Data Refresh
- **Frequency**: Every 24 hours
- **Method**: Background refresh on app startup
- **Fallback**: Local storage with enhanced static data
- **Quality**: Confidence scoring for all data points

### Smart Data Matching
- **Priority 1**: Exact match (state + role + metro + industry)
- **Priority 2**: State + role + industry
- **Priority 3**: State + role
- **Priority 4**: Fallback to enhanced static data

### Data Quality Indicators
- **Confidence Scores**: 0-100% based on source reliability
- **Last Updated**: Timestamp of most recent data refresh
- **Source Attribution**: Clear indication of data sources used

## Setup Instructions

### 1. BLS API Integration (Optional)
```bash
# Create .env.local file
cp .env.local.example .env.local

# Add your BLS API key
BLS_API_KEY=your_actual_api_key_here
```

### 2. Automatic Updates
The system automatically:
- Refreshes data every 24 hours
- Stores data locally for offline use
- Falls back to enhanced static data if APIs are unavailable
- Provides confidence scores for all calculations

## Benefits

### For Users
- **Always Current**: Data updates automatically
- **Comprehensive**: Multiple sources and industries
- **Transparent**: Clear data quality indicators
- **Reliable**: Multiple fallback options

### For IRS Compliance
- **Official Sources**: BLS government data
- **Documentation**: Clear source attribution
- **Methodology**: Professional data aggregation
- **Audit Trail**: Complete data lineage

## Technical Details

### Data Aggregation
- Weighted averaging by confidence scores
- Source prioritization (BLS > Enhanced > Industry)
- Automatic conflict resolution
- Local storage for offline functionality

### Performance
- Background refresh (non-blocking)
- Local caching for fast access
- Intelligent fallback system
- Minimal API calls

### Extensibility
- Modular data source architecture
- Easy addition of new sources
- Configurable refresh intervals
- Custom confidence scoring

## Future Enhancements

### Planned Features
- Metro area-specific data
- Company size adjustments
- Seasonal variations
- Custom industry definitions
- Data export capabilities
- Historical trend analysis

### Additional Data Sources
- LinkedIn Salary Insights
- Glassdoor Compensation Data
- Industry Association Surveys
- Regional Economic Data
- Custom Company Benchmarks 