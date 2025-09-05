/**
 * Widgets Panel Component for JARVIS
 * Weather, news, and time widgets
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslationManager } from '@/lib/translations';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
}

interface WidgetsPanelProps {
  className?: string;
}

export function WidgetsPanel({ className = '' }: WidgetsPanelProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState({ weather: false, news: false });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  const fetchWeather = async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      if (data.success) {
        setWeather(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(prev => ({ ...prev, weather: false }));
    }
  };

  // Fetch news data
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const response = await fetch(`/api/news?language=${TranslationManager.getCurrentLanguage()}`);
      const data = await response.json();
      if (data.success) {
        setNews(data.data.articles.slice(0, 3)); // Show only first 3 articles
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    fetchWeather();
    fetchNews();
  }, []);

  const formatTime = (date: Date) => {
    return TranslationManager.formatTime(date);
  };

  const formatDate = (date: Date) => {
    return TranslationManager.formatDate(date);
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return TranslationManager.t('goodMorning');
    if (hour < 17) return TranslationManager.t('goodAfternoon');
    return TranslationManager.t('goodEvening');
  };

  return (
    <div className={`w-80 h-full bg-black/40 backdrop-blur-md border-l border-cyan-400/20 overflow-y-auto ${className}`}>
      {/* Time Widget */}
      <Card className="m-4 bg-transparent border-cyan-400/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-lg flex items-center justify-between">
            {TranslationManager.t('time')}
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-mono text-white mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-cyan-400/70 mb-3">
              {formatDate(currentTime)}
            </div>
            <div className="text-sm text-purple-400">
              {getTimeOfDayGreeting()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card className="m-4 bg-transparent border-cyan-400/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-lg flex items-center justify-between">
            {TranslationManager.t('weather')}
            <Button
              onClick={fetchWeather}
              disabled={loading.weather}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:bg-cyan-400/10 p-1 h-auto"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={loading.weather ? 'animate-spin' : ''}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading.weather ? (
            <div className="text-center py-4">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-cyan-400/70 mt-2">
                {TranslationManager.t('loading')}
              </p>
            </div>
          ) : weather ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-semibold text-white">
                    {weather.temperature}°C
                  </p>
                  <p className="text-sm text-cyan-400/70">
                    {weather.location}
                  </p>
                </div>
                <div className="text-3xl">
                  {weather.icon}
                </div>
              </div>
              <p className="text-sm text-white mb-2">{weather.condition}</p>
              <div className="flex justify-between text-xs text-cyan-400/70">
                <span>Humidity: {weather.humidity}%</span>
                <span>Wind: {weather.windSpeed} km/h</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-cyan-400/70">
              <p className="text-sm">
                {TranslationManager.t('errorOccurred')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Widget */}
      <Card className="m-4 bg-transparent border-cyan-400/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-lg flex items-center justify-between">
            {TranslationManager.t('news')}
            <Button
              onClick={fetchNews}
              disabled={loading.news}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:bg-cyan-400/10 p-1 h-auto"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={loading.news ? 'animate-spin' : ''}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading.news ? (
            <div className="text-center py-4">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-cyan-400/70 mt-2">
                {TranslationManager.t('loading')}
              </p>
            </div>
          ) : news.length > 0 ? (
            <div className="space-y-3">
              {news.map((article) => (
                <div
                  key={article.id}
                  className="p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10 hover:border-cyan-400/20 transition-colors cursor-pointer"
                >
                  <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-cyan-400/70 mb-2 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex justify-between items-center text-xs text-cyan-400/50">
                    <span>{article.source}</span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-cyan-400/70">
              <p className="text-sm">
                {TranslationManager.t('errorOccurred')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}