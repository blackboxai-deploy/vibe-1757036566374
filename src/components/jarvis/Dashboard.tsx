/**
 * Main JARVIS Dashboard Component
 * Orchestrates all JARVIS functionality
 */

'use client';

import React, { useEffect } from 'react';
import { VoiceButton } from './VoiceButton';
import { ChatArea } from './ChatArea';
import { Sidebar } from './Sidebar';
import { WidgetsPanel } from './WidgetsPanel';
import { useJarvis } from '@/hooks/useJarvis';
import { TranslationManager } from '@/lib/translations';
import { StorageManager } from '@/lib/storage';

export function Dashboard() {
  const jarvis = useJarvis();

  // Initialize language from stored profile
  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile.language !== jarvis.state.currentLanguage) {
      TranslationManager.setLanguage(profile.language);
    }
  }, [jarvis.state.currentLanguage]);

  // Handle command execution from sidebar
  const handleCommandExecute = async (command: string) => {
    switch (command) {
      case 'weather':
        await jarvis.sendMessage('What\'s the current weather?');
        break;
      case 'news':
        await jarvis.sendMessage('Show me the latest news');
        break;
      case 'time':
        await jarvis.sendMessage('What time is it?');
        break;
      default:
        await jarvis.sendMessage(command);
    }
  };

  // Show loading state while initializing
  if (!jarvis.state.isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">
            {TranslationManager.t('appName')}
          </h1>
          <p className="text-cyan-400/70">
            Initializing systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black text-white overflow-hidden"
      dir={TranslationManager.getDirection()}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-purple-900/20" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar */}
        <Sidebar
          onCommandExecute={handleCommandExecute}
          onLanguageToggle={jarvis.toggleLanguage}
          currentLanguage={jarvis.state.currentLanguage}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with JARVIS Branding */}
          <div className="p-6 border-b border-cyan-400/20 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                  {TranslationManager.t('appName')}
                </h1>
                <p className="text-sm text-cyan-400/70 mt-1">
                  {TranslationManager.t('subtitle')}
                </p>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                {jarvis.state.error && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-xs">Error</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs">
                    {jarvis.state.isConnected ? 
                      TranslationManager.t('connected') : 
                      TranslationManager.t('disconnected')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Voice Button and Chat */}
          <div className="flex-1 flex">
            {/* Central Area */}
            <div className="flex-1 flex flex-col">
              {/* Voice Control Area */}
              <div className="flex items-center justify-center py-8 border-b border-cyan-400/20 bg-gradient-to-b from-black/10 to-transparent">
                <VoiceButton
                  isListening={jarvis.speechRecognition.isListening}
                  isProcessing={jarvis.state.isProcessing}
                  isSupported={jarvis.speechRecognition.isSupported}
                  onStartListening={jarvis.speechRecognition.startListening}
                  onStopListening={jarvis.speechRecognition.stopListening}
                />
              </div>

              {/* Chat Area */}
              <div className="flex-1 bg-black/20 backdrop-blur-sm">
                <ChatArea
                  messages={jarvis.state.messages}
                  isProcessing={jarvis.state.isProcessing}
                  onSendMessage={jarvis.sendMessage}
                  onClearMessages={jarvis.clearMessages}
                  className="h-full"
                />
              </div>
            </div>

            {/* Right Widgets Panel */}
            <WidgetsPanel />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {jarvis.state.error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500/20 border border-red-400 text-red-400 px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm">{jarvis.state.error}</p>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {jarvis.state.isSpeaking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-purple-500/20 border border-purple-400 text-purple-400 px-6 py-4 rounded-lg backdrop-blur-sm text-center">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-4 bg-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {TranslationManager.t('speaking')}
              </span>
            </div>
            <button
              onClick={jarvis.stopSpeaking}
              className="text-xs text-purple-400/70 hover:text-purple-400 transition-colors"
            >
              {TranslationManager.t('stopSpeaking')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}