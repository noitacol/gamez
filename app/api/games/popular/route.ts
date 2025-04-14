import { NextResponse } from 'next/server';
import { getPopularGames } from '@/app/api';

export async function GET() {
  try {
    const games = await getPopularGames();
    return NextResponse.json({ value: games });
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular games' },
      { status: 500 }
    );
  }
} 