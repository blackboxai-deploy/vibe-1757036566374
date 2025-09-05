/**
 * Speech Recognition Hook for JARVIS
 * Handles voice input functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { SpeechManager } from '@/lib/speech';

export interface UseSpeechRecognitionOptions {
  language: 'en' | 'ar';
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition({
  language,
  onResult,
  onError,
  onStart,
  onEnd
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    const supported = SpeechManager.init();
    setIsSupported(supported);
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = 'Speech recognition not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (isListening) {
      return;
    }

    try {
      setError(null);
      setIsListening(true);
      onStart?.();

      const result = await SpeechManager.listen(language);
      
      setTranscript(result);
      setConfidence(0.9); // Mock confidence - real implementation would get this from the API
      onResult?.(result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Speech recognition failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsListening(false);
      onEnd?.();
    }
  }, [isSupported, isListening, language, onResult, onError, onStart, onEnd]);

  const stopListening = useCallback(() => {
    if (isListening) {
      SpeechManager.stopListening();
      setIsListening(false);
      onEnd?.();
    }
  }, [isListening, onEnd]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        SpeechManager.stopListening();
      }
    };
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
}