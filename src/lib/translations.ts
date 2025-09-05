/**
 * Translation utilities for JARVIS
 * Supports Arabic and English text
 */

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // App Title & Branding
  appName: {
    en: 'JARVIS',
    ar: 'جارفيس'
  },
  subtitle: {
    en: 'Smart AI Assistant',
    ar: 'مساعد ذكي متقدم'
  },

  // Main Interface
  listening: {
    en: 'Listening...',
    ar: 'أستمع...'
  },
  processing: {
    en: 'Processing...',
    ar: 'معالجة...'
  },
  speaking: {
    en: 'Speaking...',
    ar: 'أتحدث...'
  },
  ready: {
    en: 'Ready',
    ar: 'جاهز'
  },

  // Voice Controls
  startListening: {
    en: 'Click to start listening',
    ar: 'اضغط للبدء في الاستماع'
  },
  stopListening: {
    en: 'Click to stop listening',
    ar: 'اضغط لإيقاف الاستماع'
  },
  voiceNotSupported: {
    en: 'Voice recognition not supported',
    ar: 'التعرف على الصوت غير مدعوم'
  },

  // Chat Interface
  typeMessage: {
    en: 'Type your message...',
    ar: 'اكتب رسالتك...'
  },
  send: {
    en: 'Send',
    ar: 'إرسال'
  },
  clearHistory: {
    en: 'Clear History',
    ar: 'مسح التاريخ'
  },
  you: {
    en: 'You',
    ar: 'أنت'
  },
  jarvis: {
    en: 'JARVIS',
    ar: 'جارفيس'
  },

  // Quick Commands
  quickCommands: {
    en: 'Quick Commands',
    ar: 'الأوامر السريعة'
  },
  openYouTube: {
    en: 'Open YouTube',
    ar: 'فتح يوتيوب'
  },
  checkWeather: {
    en: 'Check Weather',
    ar: 'فحص الطقس'
  },
  latestNews: {
    en: 'Latest News',
    ar: 'آخر الأخبار'
  },
  currentTime: {
    en: 'Current Time',
    ar: 'الوقت الحالي'
  },

  // Widgets
  weather: {
    en: 'Weather',
    ar: 'الطقس'
  },
  news: {
    en: 'News',
    ar: 'الأخبار'
  },
  time: {
    en: 'Time',
    ar: 'الوقت'
  },
  date: {
    en: 'Date',
    ar: 'التاريخ'
  },

  // Settings
  settings: {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  language: {
    en: 'Language',
    ar: 'اللغة'
  },
  theme: {
    en: 'Theme',
    ar: 'المظهر'
  },
  voice: {
    en: 'Voice',
    ar: 'الصوت'
  },
  profile: {
    en: 'Profile',
    ar: 'الملف الشخصي'
  },
  name: {
    en: 'Name',
    ar: 'الاسم'
  },
  save: {
    en: 'Save',
    ar: 'حفظ'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },

  // Voice Settings
  voiceSpeed: {
    en: 'Voice Speed',
    ar: 'سرعة الصوت'
  },
  voicePitch: {
    en: 'Voice Pitch',
    ar: 'نبرة الصوت'
  },
  voiceVolume: {
    en: 'Voice Volume',
    ar: 'مستوى الصوت'
  },
  testVoice: {
    en: 'Test Voice',
    ar: 'تجربة الصوت'
  },

  // System Prompt
  systemPrompt: {
    en: 'System Prompt',
    ar: 'موجه النظام'
  },
  customizePrompt: {
    en: 'Customize AI Behavior',
    ar: 'تخصيص سلوك الذكاء الاصطناعي'
  },
  resetPrompt: {
    en: 'Reset to Default',
    ar: 'إعادة تعيين للافتراضي'
  },

  // Error Messages
  errorOccurred: {
    en: 'An error occurred',
    ar: 'حدث خطأ'
  },
  networkError: {
    en: 'Network connection error',
    ar: 'خطأ في الاتصال بالشبكة'
  },
  speechError: {
    en: 'Speech recognition error',
    ar: 'خطأ في التعرف على الكلام'
  },
  microphoneError: {
    en: 'Microphone access denied',
    ar: 'تم رفض الوصول للميكروفون'
  },

  // Status Messages
  connecting: {
    en: 'Connecting...',
    ar: 'جاري الاتصال...'
  },
  connected: {
    en: 'Connected',
    ar: 'متصل'
  },
  disconnected: {
    en: 'Disconnected',
    ar: 'غير متصل'
  },
  offline: {
    en: 'Offline',
    ar: 'غير متصل'
  },

  // Time & Date
  today: {
    en: 'Today',
    ar: 'اليوم'
  },
  yesterday: {
    en: 'Yesterday',
    ar: 'أمس'
  },
  tomorrow: {
    en: 'Tomorrow',
    ar: 'غداً'
  },
  now: {
    en: 'Now',
    ar: 'الآن'
  },

  // Weather Terms
  sunny: {
    en: 'Sunny',
    ar: 'مشمس'
  },
  cloudy: {
    en: 'Cloudy',
    ar: 'غائم'
  },
  rainy: {
    en: 'Rainy',
    ar: 'ممطر'
  },
  snowy: {
    en: 'Snowy',
    ar: 'ثلجي'
  },
  temperature: {
    en: 'Temperature',
    ar: 'درجة الحرارة'
  },
  humidity: {
    en: 'Humidity',
    ar: 'الرطوبة'
  },

  // Common Actions
  loading: {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  refresh: {
    en: 'Refresh',
    ar: 'تحديث'
  },
  close: {
    en: 'Close',
    ar: 'إغلاق'
  },
  open: {
    en: 'Open',
    ar: 'فتح'
  },
  delete: {
    en: 'Delete',
    ar: 'حذف'
  },
  edit: {
    en: 'Edit',
    ar: 'تعديل'
  },

  // Welcome Messages
  welcomeBack: {
    en: 'Welcome back',
    ar: 'أهلاً بك مرة أخرى'
  },
  howCanIHelp: {
    en: 'How can I help you today?',
    ar: 'كيف يمكنني مساعدتك اليوم؟'
  },
  goodMorning: {
    en: 'Good morning',
    ar: 'صباح الخير'
  },
  goodAfternoon: {
    en: 'Good afternoon',
    ar: 'مساء الخير'
  },
  goodEvening: {
    en: 'Good evening',
    ar: 'مساء الخير'
  }
};

export class TranslationManager {
  private static currentLanguage: Language = 'en';

  static setLanguage(language: Language): void {
    this.currentLanguage = language;
    
    // Update document direction for RTL support
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }

  static getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  static t(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[this.currentLanguage] || translation.en || key;
  }

  static getDirection(): 'ltr' | 'rtl' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  static isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }

  // Format numbers according to locale
  static formatNumber(num: number): string {
    return new Intl.NumberFormat(
      this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US'
    ).format(num);
  }

  // Format date according to locale
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat(
      this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    ).format(date);
  }

  // Format time according to locale
  static formatTime(date: Date): string {
    return new Intl.DateTimeFormat(
      this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    ).format(date);
  }
}