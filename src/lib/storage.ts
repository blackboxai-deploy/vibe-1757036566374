/**
 * LocalStorage utilities for JARVIS
 * Handles user preferences, chat history, and memory
 */

export interface UserProfile {
  name?: string;
  language: 'en' | 'ar';
  theme: 'dark' | 'light';
  voiceSettings: {
    rate: number;
    pitch: number;
    volume: number;
    voice?: string;
  };
  systemPrompt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  language: 'en' | 'ar';
}

export interface QuickCommand {
  id: string;
  name: string;
  command: string;
  description: string;
  lastUsed: number;
}

export class StorageManager {
  private static readonly KEYS = {
    USER_PROFILE: 'jarvis_user_profile',
    CHAT_HISTORY: 'jarvis_chat_history',
    QUICK_COMMANDS: 'jarvis_quick_commands',
    APP_SETTINGS: 'jarvis_app_settings'
  };

  // User Profile Management
  static getUserProfile(): UserProfile {
    const defaultProfile: UserProfile = {
      language: 'en',
      theme: 'dark',
      voiceSettings: {
        rate: 1,
        pitch: 1,
        volume: 1
      }
    };

    try {
      const stored = localStorage.getItem(this.KEYS.USER_PROFILE);
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return defaultProfile;
    }
  }

  static saveUserProfile(profile: Partial<UserProfile>): void {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Chat History Management
  static getChatHistory(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(this.KEYS.CHAT_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading chat history:', error);
      return [];
    }
  }

  static addChatMessage(message: Omit<ChatMessage, 'id'>): void {
    try {
      const history = this.getChatHistory();
      const newMessage: ChatMessage = {
        ...message,
        id: this.generateId()
      };
      
      history.push(newMessage);
      
      // Keep only last 100 messages
      const trimmed = history.slice(-100);
      
      localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error adding chat message:', error);
    }
  }

  static clearChatHistory(): void {
    try {
      localStorage.removeItem(this.KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  // Quick Commands Management
  static getQuickCommands(): QuickCommand[] {
    const defaultCommands: QuickCommand[] = [
      {
        id: 'youtube',
        name: 'Open YouTube',
        command: 'https://youtube.com',
        description: 'Open YouTube in a new tab',
        lastUsed: 0
      },
      {
        id: 'weather',
        name: 'Check Weather',
        command: 'weather',
        description: 'Get current weather information',
        lastUsed: 0
      },
      {
        id: 'news',
        name: 'Latest News',
        command: 'news',
        description: 'Get latest news headlines',
        lastUsed: 0
      },
      {
        id: 'time',
        name: 'Current Time',
        command: 'time',
        description: 'Show current time and date',
        lastUsed: 0
      }
    ];

    try {
      const stored = localStorage.getItem(this.KEYS.QUICK_COMMANDS);
      return stored ? JSON.parse(stored) : defaultCommands;
    } catch (error) {
      console.error('Error reading quick commands:', error);
      return defaultCommands;
    }
  }

  static updateQuickCommandUsage(commandId: string): void {
    try {
      const commands = this.getQuickCommands();
      const command = commands.find(cmd => cmd.id === commandId);
      
      if (command) {
        command.lastUsed = Date.now();
        localStorage.setItem(this.KEYS.QUICK_COMMANDS, JSON.stringify(commands));
      }
    } catch (error) {
      console.error('Error updating command usage:', error);
    }
  }

  // App Settings
  static getAppSettings() {
    const defaults = {
      micSensitivity: 0.8,
      autoSpeak: false,
      soundEffects: true,
      notifications: true
    };

    try {
      const stored = localStorage.getItem(this.KEYS.APP_SETTINGS);
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch (error) {
      console.error('Error reading app settings:', error);
      return defaults;
    }
  }

  static saveAppSettings(settings: any): void {
    try {
      const current = this.getAppSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.KEYS.APP_SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  }

  // Utility Methods
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static clearAllData(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  static exportData(): string {
    try {
      const data = {
        profile: this.getUserProfile(),
        history: this.getChatHistory(),
        commands: this.getQuickCommands(),
        settings: this.getAppSettings(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.settings) this.saveAppSettings(data.settings);
      if (data.commands) localStorage.setItem(this.KEYS.QUICK_COMMANDS, JSON.stringify(data.commands));
      if (data.history) localStorage.setItem(this.KEYS.CHAT_HISTORY, JSON.stringify(data.history));
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}