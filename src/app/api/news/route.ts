/**
 * News API endpoint for JARVIS
 * Fetches latest news headlines
 */

import { NextRequest, NextResponse } from 'next/server';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const language = searchParams.get('language') || 'en';

    // For demo purposes, we'll return mock news data
    // In production, you would integrate with a news API like NewsAPI
    const mockNews: NewsArticle[] = generateMockNews(language, category);

    return NextResponse.json({
      success: true,
      data: {
        articles: mockNews,
        totalResults: mockNews.length,
        category,
        language
      },
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}

function generateMockNews(language: string, category: string): NewsArticle[] {
  const newsTemplates = {
    en: {
      technology: [
        { title: 'AI Breakthrough in Machine Learning', summary: 'New advances in artificial intelligence show promising results for automated systems.' },
        { title: 'Tech Giants Announce New Partnerships', summary: 'Major technology companies form strategic alliances for future innovation.' },
        { title: 'Quantum Computing Reaches New Milestone', summary: 'Scientists achieve significant progress in quantum computing capabilities.' }
      ],
      business: [
        { title: 'Global Markets Show Strong Growth', summary: 'International stock markets demonstrate positive trends across multiple sectors.' },
        { title: 'Startup Funding Reaches Record High', summary: 'Investment in new technology startups hits unprecedented levels this quarter.' },
        { title: 'Economic Indicators Point to Recovery', summary: 'Key economic metrics suggest continued improvement in global markets.' }
      ],
      general: [
        { title: 'Innovation Summit Draws Global Leaders', summary: 'World leaders gather to discuss future of technology and innovation.' },
        { title: 'Climate Technology Shows Promise', summary: 'New environmental technologies offer hope for sustainable future solutions.' },
        { title: 'Education Sector Embraces Digital Transformation', summary: 'Schools and universities accelerate adoption of modern learning technologies.' }
      ]
    },
    ar: {
      technology: [
        { title: 'اختراق جديد في الذكاء الاصطناعي', summary: 'تطورات جديدة في الذكاء الاصطناعي تظهر نتائج واعدة للأنظمة الآلية.' },
        { title: 'شراكات جديدة بين عمالقة التكنولوجيا', summary: 'شركات التكنولوجيا الكبرى تشكل تحالفات استراتيجية للابتكار المستقبلي.' },
        { title: 'الحوسبة الكمية تحقق إنجازاً جديداً', summary: 'العلماء يحققون تقدماً كبيراً في قدرات الحوسبة الكمية.' }
      ],
      business: [
        { title: 'الأسواق العالمية تظهر نمواً قوياً', summary: 'أسواق الأسهم الدولية تظهر اتجاهات إيجابية عبر قطاعات متعددة.' },
        { title: 'تمويل الشركات الناشئة يحقق رقماً قياسياً', summary: 'الاستثمار في شركات التكنولوجيا الناشئة يصل لمستويات غير مسبوقة.' },
        { title: 'المؤشرات الاقتصادية تشير للتعافي', summary: 'المقاييس الاقتصادية الرئيسية تشير لتحسن مستمر في الأسواق العالمية.' }
      ],
      general: [
        { title: 'قمة الابتكار تجمع القادة العالميين', summary: 'قادة العالم يجتمعون لمناقشة مستقبل التكنولوجيا والابتكار.' },
        { title: 'تكنولوجيا المناخ تظهر إمكانيات واعدة', summary: 'التقنيات البيئية الجديدة تقدم الأمل لحلول مستقبلية مستدامة.' },
        { title: 'قطاع التعليم يتبنى التحول الرقمي', summary: 'المدارس والجامعات تسرع اعتماد تقنيات التعلم الحديثة.' }
      ]
    }
  };

  const templates = newsTemplates[language as keyof typeof newsTemplates] || newsTemplates.en;
  const categoryTemplates = templates[category as keyof typeof templates] || templates.general;

  return categoryTemplates.map((template, index) => ({
    id: `news-${Date.now()}-${index}`,
    title: template.title,
    summary: template.summary,
    source: getRandomSource(language),
    publishedAt: getRandomDate(),
    category,
    url: '#'
  }));
}

function getRandomSource(language: string): string {
  const sources = {
    en: ['Tech News', 'Global Times', 'Innovation Daily', 'Future Report', 'Digital World'],
    ar: ['الأخبار التقنية', 'العالم الرقمي', 'تقرير المستقبل', 'الابتكار اليومي', 'التكنولوجيا الحديثة']
  };

  const sourcelist = sources[language as keyof typeof sources] || sources.en;
  return sourcelist[Math.floor(Math.random() * sourcelist.length)];
}

function getRandomDate(): string {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 12) + 1;
  const publishedTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
  return publishedTime.toISOString();
}

export async function POST() {
  return NextResponse.json({
    status: 'News API is operational',
    version: '1.0.0',
    features: ['headlines', 'categories', 'multilingual'],
    supportedLanguages: ['en', 'ar']
  });
}