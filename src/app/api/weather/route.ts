/**
 * Weather API endpoint for JARVIS
 * Fetches current weather and forecast data
 */

import { NextRequest, NextResponse } from 'next/server';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'London';

    // For demo purposes, we'll return mock weather data
    // In production, you would integrate with a weather API like OpenWeatherMap
    const mockWeatherData: WeatherData = {
      location: location,
      temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
      condition: getRandomCondition(),
      humidity: Math.floor(Math.random() * 60) + 40, // 40-100%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      icon: '☀️',
      forecast: generateForecast()
    };

    return NextResponse.json({
      success: true,
      data: mockWeatherData,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

function getRandomCondition(): string {
  const conditions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Clear', 'Overcast', 'Windy'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

function generateForecast() {
  const days = ['Today', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday'];
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
  const icons = ['☀️', '☁️', '🌧️', '⛅', '🌤️'];

  return days.map(day => ({
    day,
    high: Math.floor(Math.random() * 25) + 10, // 10-35°C
    low: Math.floor(Math.random() * 15) + 0,   // 0-15°C
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    icon: icons[Math.floor(Math.random() * icons.length)]
  }));
}

// Health check endpoint
export async function POST() {
  return NextResponse.json({
    status: 'Weather API is operational',
    version: '1.0.0',
    features: ['current-weather', 'forecast', 'multiple-locations']
  });
}