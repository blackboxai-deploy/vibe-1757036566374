/**
 * Speech utilities for JARVIS
 * Handles text-to-speech and speech-to-text functionality
 */

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechConfig {
  language: 'en' | 'ar';
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechManager {
  private static synthesis: SpeechSynthesis | null = null;
  private static recognition: any = null;
  private static isRecording = false;

  static init(): boolean {
    if (typeof window === 'undefined') return false;

    // Initialize text-to-speech
    this.synthesis = window.speechSynthesis;

    // Initialize speech-to-text
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }

    return !!(this.synthesis && this.recognition);
  }

  static speak(text: string, config: SpeechConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = config.language === 'ar' ? 'ar-SA' : 'en-US';
      
      // Apply config
      if (config.rate) utterance.rate = config.rate;
      if (config.pitch) utterance.pitch = config.pitch;
      if (config.volume) utterance.volume = config.volume;

      // Find appropriate voice
      const voices = this.synthesis.getVoices();
      if (config.voice) {
        const selectedVoice = voices.find(v => v.name === config.voice);
        if (selectedVoice) utterance.voice = selectedVoice;
      } else {
        // Auto-select voice based on language
        const preferredVoice = voices.find(v => 
          config.language === 'ar' 
            ? v.lang.startsWith('ar')
            : v.lang.startsWith('en')
        );
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  static listen(language: 'en' | 'ar'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      if (this.isRecording) {
        reject(new Error('Already recording'));
        return;
      }

      // Set language
      this.recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

      let hasResult = false;

      this.recognition.onstart = () => {
        this.isRecording = true;
      };

      this.recognition.onresult = (event) => {
        hasResult = true;
        const result = event.results[0][0].transcript;
        this.isRecording = false;
        resolve(result);
      };

      this.recognition.onerror = (event) => {
        this.isRecording = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        if (!hasResult) {
          reject(new Error('No speech detected'));
        }
      };

      this.recognition.start();
    });
  }

  static stopListening(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  static stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  static getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  static get isListening(): boolean {
    return this.isRecording;
  }

  static get isSupported(): boolean {
    return !!(this.synthesis && this.recognition);
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  // Wait for voices to load
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      SpeechManager.init();
    };
    SpeechManager.init();
  }
}