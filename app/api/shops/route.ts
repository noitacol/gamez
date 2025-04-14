import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = "a641457f34e7addea08c7dba6af6579766b57dc2";
  const API_URL = "https://api.isthereanydeal.com";
  
  try {
    const response = await fetch(`${API_URL}/service/shops/v1/?key=${API_KEY}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'API isteği sırasında bir hata oluştu' }, { status: 500 });
  }
} 