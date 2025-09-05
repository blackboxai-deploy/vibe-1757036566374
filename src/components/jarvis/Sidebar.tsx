/**
 * Sidebar Component for JARVIS
 * Quick commands and navigation
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslationManager } from '@/lib/translations';
import { StorageManager } from '@/lib/storage';

interface SidebarProps {
  onCommandExecute: (command: string) => void;
  onLanguageToggle: () => void;
  currentLanguage: 'en' | 'ar';
  className?: string;
}

export function Sidebar({
  onCommandExecute,
  onLanguageToggle,
  currentLanguage,
  className = ''
}: SidebarProps) {
  const quickCommands = StorageManager.getQuickCommands();

  const executeCommand = async (command: string, commandId: string) => {
    // Update usage statistics
    StorageManager.updateQuickCommandUsage(commandId);

    // Handle different command types
    if (command.startsWith('http')) {
      // Open URL in new tab
      window.open(command, '_blank');
    } else {
      // Execute as JARVIS command
      onCommandExecute(command);
    }
  };

  const handleLanguageToggle = () => {
    onLanguageToggle();
  };

  return (
    <div className={`w-64 h-full bg-black/40 backdrop-blur-md border-r border-cyan-400/20 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-cyan-400/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-cyan-400">
            {TranslationManager.t('appName')}
          </h2>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">
              {TranslationManager.t('connected')}
            </span>
          </div>
        </div>
        <p className="text-sm text-cyan-400/70">
          {TranslationManager.t('subtitle')}
        </p>
      </div>

      {/* Language Toggle */}
      <div className="p-4 border-b border-cyan-400/20">
        <Button
          onClick={handleLanguageToggle}
          variant="outline"
          className="w-full bg-transparent border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{currentLanguage === 'en' ? '🇺🇸' : '🇸🇦'}</span>
            <span>{currentLanguage === 'en' ? 'English' : 'العربية'}</span>
          </div>
        </Button>
      </div>

      {/* Quick Commands */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-cyan-400 mb-3">
          {TranslationManager.t('quickCommands')}
        </h3>
        
        <div className="space-y-2">
          {quickCommands.map((cmd) => (
            <Card 
              key={cmd.id}
              className="bg-transparent border-cyan-400/20 hover:border-cyan-400/40 cursor-pointer transition-all duration-200 hover:bg-cyan-400/5"
              onClick={() => executeCommand(cmd.command, cmd.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                    {getCommandIcon(cmd.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {getCommandName(cmd.id)}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {getCommandDescription(cmd.id)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-400/20">
        <Card className="bg-transparent border-cyan-400/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">{TranslationManager.t('time')}</span>
              <span className="text-cyan-400 font-mono">
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-white/60">Status</span>
              <span className="text-green-400">Online</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getCommandIcon(commandId: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    youtube: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>
      </svg>
    ),
    weather: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
    news: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8"/>
        <path d="M15 18h-5"/>
        <path d="M10 6h8v4h-8V6Z"/>
      </svg>
    ),
    time: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    )
  };

  return iconMap[commandId] || (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function getCommandName(commandId: string): string {
  const nameMap: Record<string, string> = {
    youtube: TranslationManager.t('openYouTube'),
    weather: TranslationManager.t('checkWeather'),
    news: TranslationManager.t('latestNews'),
    time: TranslationManager.t('currentTime')
  };

  return nameMap[commandId] || commandId;
}

function getCommandDescription(commandId: string): string {
  const descMap: Record<string, string> = {
    youtube: 'Open YouTube in new tab',
    weather: 'Get current weather',
    news: 'Latest news headlines',
    time: 'Show current time'
  };

  return descMap[commandId] || 'Execute command';
}