// Note: BLS API requires server-side functionality due to CORS and API key requirements
// For static export, we'll provide a placeholder that explains the limitation

export interface BLSRequest {
  seriesid: string[];
  startyear: string;
  endyear: string;
}

export interface BLSResponse {
  success: boolean;
  message: string;
  note?: string;
}

export function getBLSData(request: BLSRequest): BLSResponse {
  // Since this is a static export, we can't make actual API calls
  // Return a message explaining the limitation
  return {
    success: false,
    message: 'BLS API functionality is not available in static export mode',
    note: 'This feature requires server-side rendering. Consider deploying to a platform that supports API routes (Vercel, Netlify, etc.) or use the client-side salary calculator instead.'
  };
}

// Alternative: Provide sample/static BLS data for demonstration
export const SAMPLE_BLS_DATA = {
  "series": [
    {
      "seriesID": "CES0000000001",
      "data": [
        {
          "year": "2023",
          "period": "M12",
          "periodName": "December",
          "value": "158.1",
          "footnotes": [{}]
        },
        {
          "year": "2023",
          "period": "M11",
          "periodName": "November",
          "value": "158.0",
          "footnotes": [{}]
        }
      ]
    }
  ]
};
