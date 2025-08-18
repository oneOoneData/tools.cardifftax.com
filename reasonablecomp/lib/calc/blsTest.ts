// Test file for BLS API integration
import { BLSAPIClient } from './blsApi';

// Test function to verify BLS API integration
export async function testBLSIntegration(): Promise<void> {
  console.log('🧪 Testing BLS API Integration...');
  
  try {
    const client = new BLSAPIClient();
    
    // Test single role fetch
    console.log('📊 Testing single role fetch...');
    const execSalary = await client.fetchCompensationData('CA', 'exec', 2024);
    console.log(`CA Executive Salary: ${execSalary ? `$${execSalary.toLocaleString()}` : 'Not available'}`);
    
    // Test multiple roles fetch
    console.log('📊 Testing multiple roles fetch...');
    const multipleRoles = await client.fetchMultipleRoles('CA', ['exec', 'admin', 'tech'], 2024);
    console.log('CA Multiple Roles:', multipleRoles);
    
    // Test usage tracking
    const usage = client.getDailyUsage();
    console.log('📈 Daily Usage:', usage);
    
    console.log('✅ BLS API integration test completed successfully!');
  } catch (error) {
    console.error('❌ BLS API integration test failed:', error);
  }
}

// Export test functions
export const BLSTests = {
  testIntegration: testBLSIntegration,
}; 