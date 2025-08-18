import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Proxy the request to BLS API
    const blsResponse = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BLS-API-Version': '2',
      },
      body: JSON.stringify(body),
    });

    if (!blsResponse.ok) {
      const errorText = await blsResponse.text();
      console.error(`BLS API error: ${blsResponse.status} ${blsResponse.statusText}`, errorText);
      return NextResponse.json(
        { error: `BLS API error: ${blsResponse.status} ${blsResponse.statusText}` },
        { status: blsResponse.status }
      );
    }

    const data = await blsResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying BLS API request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

