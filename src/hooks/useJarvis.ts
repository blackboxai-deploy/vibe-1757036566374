/**
 * Main JARVIS Hook
 * Central state management for JARVIS functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { StorageManager } from '@/lib/storage';
import { SpeechManager, SpeechConfig } from '@/lib/speech';
import { TranslationManager, Language } from '@/lib/translations';
import { useSpeechRecognition } from './useSpeechRecognition';

export interface JarvisMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface JarvisState {
  isInitialized: boolean;
  isConnected: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  messages: JarvisMessage[];
  currentLanguage: Language;
  userName?: string;
  error: string | null;
}

export interface UseJarvisReturn {
  state: JarvisState;
  sendMessage: (content: string) => Promise<void>;
  sendVoiceMessage: (transcript: string) => Promise<void>;
  clearMessages: () => void;
  toggleLanguage: () => void;
  setUserName: (name: string) => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  speechRecognition: ReturnType<typeof useSpeechRecognition>;
}

export function useJarvis(): UseJarvisReturn {
  // Initialize state
  const [state, setState] = useState<JarvisState>({
    isInitialized: false,
    isConnected: true,
    isProcessing: false,
    isSpeaking: false,
    messages: [],
    currentLanguage: 'en',
    error: null
  });

  // Initialize speech recognition
  const speechRecognition = useSpeechRecognition({
    language: state.currentLanguage,
    onResult: (transcript) => {
      sendVoiceMessage(transcript);
    },
    onError: (error) => {
      setState(prev => ({ ...prev, error }));
    },
    onStart: () => {
      setState(prev => ({ ...prev, error: null }));
    }
  });

  // Initialize JARVIS
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load user profile
        const profile = StorageManager.getUserProfile();
        
        // Set language
        TranslationManager.setLanguage(profile.language);
        
        // Load chat history
        const history = StorageManager.getChatHistory();
        const messages = history.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }));

        // Initialize speech manager
        SpeechManager.init();

        setState(prev => ({
          ...prev,
          isInitialized: true,
          currentLanguage: profile.language,
          userName: profile.name,
          messages
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize JARVIS',
          isInitialized: true
        }));
      }
    };

    initialize();
  }, []);

  // Send text message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isProcessing) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    const userMessage: JarvisMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    // Add user message immediately
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    // Save to storage
    StorageManager.addChatMessage({
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      language: state.currentLanguage
    });

    try {
      // Prepare messages for API
      const apiMessages = [
        ...state.messages.slice(-10), // Keep last 10 messages for context
        userMessage
      ].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: apiMessages,
          language: state.currentLanguage,
          userName: state.userName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'AI service error');
      }

      const assistantMessage: JarvisMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      // Add assistant message
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isProcessing: false
      }));

      // Save to storage
      StorageManager.addChatMessage({
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        language: state.currentLanguage
      });

      // Auto-speak response if enabled
      const settings = StorageManager.getAppSettings();
      if (settings.autoSpeak) {
        await speak(data.message);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [state.isProcessing, state.messages, state.currentLanguage, state.userName]);

  // Send voice message (same as text but triggered by voice)
  const sendVoiceMessage = useCallback(async (transcript: string) => {
    await sendMessage(transcript);
  }, [sendMessage]);

  // Clear message history
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
    StorageManager.clearChatHistory();
  }, []);

  // Toggle language
  const toggleLanguage = useCallback(() => {
    const newLanguage: Language = state.currentLanguage === 'en' ? 'ar' : 'en';
    
    TranslationManager.setLanguage(newLanguage);
    StorageManager.saveUserProfile({ language: newLanguage });
    
    setState(prev => ({ ...prev, currentLanguage: newLanguage }));
  }, [state.currentLanguage]);

  // Set user name
  const setUserName = useCallback((name: string) => {
    StorageManager.saveUserProfile({ name });
    setState(prev => ({ ...prev, userName: name }));
  }, []);

  // Text to speech
  const speak = useCallback(async (text: string) => {
    try {
      setState(prev => ({ ...prev, isSpeaking: true }));
      
      const profile = StorageManager.getUserProfile();
      const config: SpeechConfig = {
        language: state.currentLanguage,
        rate: profile.voiceSettings.rate,
        pitch: profile.voiceSettings.pitch,
        volume: profile.voiceSettings.volume,
        voice: profile.voiceSettings.voice
      };

      await SpeechManager.speak(text, config);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Speech synthesis failed' }));
    } finally {
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [state.currentLanguage]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    SpeechManager.stopSpeaking();
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  return {
    state,
    sendMessage,
    sendVoiceMessage,
    clearMessages,
    toggleLanguage,
    setUserName,
    speak,
    stopSpeaking,
    speechRecognition
  };
}