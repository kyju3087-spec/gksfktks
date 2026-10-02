import type { BookInput, GeneratedReviewData } from '../types/book';

/**
 * 책 리뷰 및 목적별 문구 생성 요청 함수
 * 1차: 서버의 안전한 프록시 엔드포인트 (/api/generate-review) 호출
 * 2차 (Vercel 정적 배포 fallback): 만약 백엔드 서버 없이 정적 호스팅되는 환경이고 VITE_GEMINI_API_KEY가 존재할 경우 클라이언트 직접 호출 fallback
 */
export async function generateBookReview(input: BookInput): Promise<GeneratedReviewData> {
  // 1. 서버 API 호출 시도
  try {
    const res = await fetch('/api/generate-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data: GeneratedReviewData = await res.json();
      return data;
    }

    // 서버가 에러 메시지를 반환한 경우
    const errorJson = await res.json().catch(() => null);
    if (res.status !== 404 && errorJson?.error) {
      throw new Error(errorJson.error);
    }
  } catch (err: any) {
    // 404나 네트워크 실패가 아니라 명시적 비즈니스 에러인 경우 바로 던짐
    if (err.message && !err.message.includes('fetch') && !err.message.includes('404')) {
      throw err;
    }
    console.warn('서버 API 미응답 또는 정적 호스팅 환경 감지, 클라이언트 fallback 확인 중...');
  }

  // 2. 정적 호스팅(Vercel SPA 등) 클라이언트 fallback
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!clientKey) {
    throw new Error(
      'API 키가 감지되지 않았습니다. .env 파일의 GEMINI_API_KEY 또는 Vercel 환경 변수를 확인해주세요.'
    );
  }

  // 동적 import로 브라우저 번들 최적화
  const { GoogleGenAI, Type } = await import('@google/genai');
  const ai = new GoogleGenAI({
    apiKey: clientKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const toneDescriptions: Record<string, string> = {
    warm: '따뜻하고 공감대를 형성하는 차분한 감성 정중체 (~합니다, ~해요)',
    intellectual: '사유가 깊고 통찰력 있는 지적인 정중체 (~입니다, ~합니다)',
    conversational: '카페에서 편안하게 대화하듯 전하는 친근한 대화체 (~해요, ~했답니다)',
    poetic: '여운이 남고 은유와 감각이 돋보이는 서정적인 문체 (~합니다, ~바라봅니다)',
  };

  const selectedTone = toneDescriptions[input.tone || 'warm'] || toneDescriptions.warm;

  const systemInstruction = `
당신은 책 리뷰 작성과 독서 후 활용할 만한 문구 및 소셜 미디어 게시글을 작성해 주는 '독서 & AI 문구 생성 에이전트'입니다.
사용자가 읽은 책 정보, 주요 인상 깊었던 구절, 감상평을 입력받아 목적별 4개 파트의 글을 작성합니다.

[중요 원칙 및 문체 가이드라인]
1. 문체: ${selectedTone}를 일관되게 유지하십시오.
2. 가독성: 적절한 이모지와 불릿 포인트를 적극적으로 활용하여 시각적으로 정갈하고 읽기 편하게 배치하십시오.
3. 지식 보완 (매우 중요):
   - 사용자가 입력한 내용(줄거리나 구절, 감상평)이 짧거나 비어있더라도, 당신의 도서 지식을 총동원하여 책의 저자, 핵심 배경, 주제 의식, 상징성, 인상 깊은 정수를 완벽하게 보완하여 풍부하게 서술하십시오.
4. 반드시 지정된 JSON 구조에 맞춰 반환하십시오.
`;

  const userPrompt = `
다음 도서에 대한 독서 리뷰와 소셜 미디어 문구를 생성해주세요:
- 책 제목: ${input.title}
${input.author ? `- 저자/출판사: ${input.author}` : ''}
${input.genre ? `- 장르/분야: ${input.genre}` : ''}
${input.quote ? `- 인상 깊었던 구절: "${input.quote}"` : '- 사용자가 입력한 구절: (제공되지 않음 -> 핵심 구절을 AI가 발췌 보완)'}
${input.personalReview ? `- 감상평: "${input.personalReview}"` : '- 사용자의 감상평: (제공되지 않음 -> 책의 울림을 토대로 AI가 보완)'}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bookInfo: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              genre: { type: Type.STRING },
              moodTag: { type: Type.STRING },
              aiSupplementedNote: { type: Type.STRING },
            },
            required: ['title', 'author'],
          },
          part1: {
            type: Type.OBJECT,
            properties: {
              coreSummary: { type: Type.STRING },
              threeLineReview: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['coreSummary', 'threeLineReview'],
          },
          part2: {
            type: Type.OBJECT,
            properties: {
              catchyTitle: { type: Type.STRING },
              intro: { type: Type.STRING },
              coreThemeAndPlot: { type: Type.STRING },
              personalThoughts: { type: Type.STRING },
              recommendedTarget: { type: Type.STRING },
              fullMarkdownContent: { type: Type.STRING },
            },
            required: ['catchyTitle', 'intro', 'coreThemeAndPlot', 'personalThoughts', 'recommendedTarget', 'fullMarkdownContent'],
          },
          part3: {
            type: Type.OBJECT,
            properties: {
              instagram: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  cardSlideQuotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'caption', 'cardSlideQuotes', 'hashtags'],
              },
              twitter: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  charCount: { type: Type.INTEGER },
                },
                required: ['text', 'charCount'],
              },
              threads: {
                type: Type.OBJECT,
                properties: {
                  post: { type: Type.STRING },
                },
                required: ['post'],
              },
            },
            required: ['instagram', 'twitter', 'threads'],
          },
          part4: {
            type: Type.OBJECT,
            properties: {
              bookClubQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              calligraphyQuote: { type: Type.STRING },
              kakaoRecommendation: { type: Type.STRING },
            },
            required: ['bookClubQuestions', 'calligraphyQuote', 'kakaoRecommendation'],
          },
        },
        required: ['bookInfo', 'part1', 'part2', 'part3', 'part4'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini로부터 유효한 텍스트 응답을 수신하지 못했습니다.');
  }

  return JSON.parse(text) as GeneratedReviewData;
}
