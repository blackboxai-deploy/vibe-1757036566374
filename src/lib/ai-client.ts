/**
 * OpenRouter AI Client for JARVIS
 * Handles chat completions with Claude-Sonnet-4
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class AIClient {
  private static readonly ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
  private static readonly MODEL = 'openrouter/anthropic/claude-sonnet-4';
  
  private static readonly HEADERS = {
    'customerId': 'mrwannasrlymhmwd@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  static async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: this.MODEL,
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: data.choices?.[0]?.message?.content || 'No response generated'
      };
    } catch (error) {
      console.error('AI Client Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static createSystemPrompt(language: 'en' | 'ar', userName?: string): string {
    const prompts = {
      en: `You are JARVIS, an advanced AI assistant inspired by Tony Stark's AI companion. You are sophisticated, helpful, and slightly witty. 

Key behaviors:
- Be concise but informative
- Show personality - you're not just a tool, you're a companion
- Use a slightly formal but friendly tone
- When appropriate, make subtle references to being an AI assistant (not overly dramatic)
- Help with tasks efficiently
- Remember context from the conversation

${userName ? `The user's name is ${userName}.` : 'Address the user respectfully.'}

Always respond in English unless specifically asked to use Arabic.`,

      ar: `أنت جارفيس، مساعد ذكي متقدم مستوحى من مساعد توني ستارك الذكي. أنت متطور ومفيد وذكي قليلاً.

السلوكيات الأساسية:
- كن موجزاً لكن مفيداً
- أظهر الشخصية - لست مجرد أداة، بل رفيق
- استخدم نبرة رسمية قليلاً لكن ودية
- عند الضرورة، اشر بشكل خفيف إلى كونك مساعد ذكي
- ساعد في المهام بكفاءة
- تذكر السياق من المحادثة

${userName ? `اسم المستخدم هو ${userName}.` : 'خاطب المستخدم باحترام.'}

اجب دائماً بالعربية إلا إذا طُلب منك استخدام الإنجليزية.`
    };

    return prompts[language];
  }
}