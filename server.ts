import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Gemini API Key 로드 (환경 변수에서 안전하게 취득)
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 책 리뷰 생성 API
app.post('/api/generate-review', async (req, res) => {
  try {
    const { title, author, quote, personalReview, tone = 'warm', genre } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: '책 제목을 입력해주세요.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일 또는 Vercel 환경 변수를 확인해주세요.',
      });
    }

    const toneDescriptions: Record<string, string> = {
      warm: '따뜻하고 공감대를 형성하는 차분한 감성 정중체 (~합니다, ~해요)',
      intellectual: '사유가 깊고 통찰력 있는 지적인 정중체 (~입니다, ~합니다)',
      conversational: '카페에서 편안하게 커피 한잔하며 대화하듯 전하는 친근한 대화체 (~해요, ~했답니다)',
      poetic: '여운이 남고 은유와 감각이 돋보이는 서정적인 문체 (~합니다, ~바라봅니다)',
    };

    const selectedTone = toneDescriptions[tone] || toneDescriptions.warm;

    const systemInstruction = `
당신은 책 리뷰 작성과 독서 후 활용할 만한 문구 및 소셜 미디어 게시글을 전문적으로 작성해 주는 '독서 & AI 문구 생성 에이전트'입니다.
사용자가 읽은 책 정보, 주요 인상 깊었던 구절, 감상평을 입력받아 목적별 4개 파트의 글을 작성합니다.

[중요 원칙 및 문체 가이드라인]
1. 문체: ${selectedTone}를 일관되게 유지하십시오.
2. 가독성: 적절한 이모지와 불릿 포인트를 적극적으로 활용하여 시각적으로 정갈하고 읽기 편하게 배치하십시오.
3. 지식 보완 (매우 중요):
   - 사용자가 입력한 내용(줄거리나 구절, 감상평)이 짧거나 비어있더라도, 당신의 광범위한 도서 지식을 총동원하여 책의 저자, 핵심 배경, 주제 의식, 상징성, 인상 깊은 정수를 완벽하게 보완하여 풍부하고 생생하게 서술하십시오.
   - 단, 사용자가 직접 제공한 인상 깊은 구절이나 개인 감상이 있다면 그것을 글 전체의 중심 통찰로 깊이 있게 녹여내십시오.
4. 반드시 지정된 JSON 구조에 맞춰 한 치의 오차 없이 충실한 내용을 담아 반환하십시오.

[작성해야 하는 4개 파트 상세 규격]
1. 📖 책 핵심 요약 & 3줄 리뷰 (part1)
   - coreSummary: 책의 중심 주제와 핵심 메시지 요약 (3~4문장)
   - threeLineReview: 읽는 사람의 마음에 즉각 각인되는 간결하고 명확한 3줄 리뷰 (정확히 3개의 문자열 배열)

2. ✍️ 감성 블로그/노션용 긴 리뷰 (part2)
   - catchyTitle: 클릭을 유도하고 마음에 와닿는 매력적인 제목
   - intro: 책을 펼치게 된 계기나 계절감/일상의 정서를 담은 몰입감 있는 서두 (1~2단락)
   - coreThemeAndPlot: 책의 핵심 줄거리 및 다루는 주제를 깊이 있게 풀어낸 단락
   - personalThoughts: 책 속 문장이 내 삶에 남긴 자국과 개인적인 소회
   - recommendedTarget: "이런 분들이 읽으시면 참 좋습니다" 추천 대상 (3~4가지 불릿)
   - fullMarkdownContent: 블로그나 노션에 그대로 복사-붙여넣기할 수 있는 완전체 마크다운 텍스트 (제목, 소제목, 인용구, 본문, 추천대상 포함)

3. 📱 소셜 미디어 맞춤형 숏폼 문구 (part3)
   - instagram: 카드뉴스/인스타 캡션용. visual한 느낌의 제목, 감성 캡션 본문, 카드뉴스 각 슬라이드에 넣을 3~4개의 짧은 인용구, 그리고 인기 해시태그 5~8개 (#책스타그램 #북스타그램 등 포함)
   - twitter: 트위터(X)용. 반드시 공백 포함 140자 이내의 강렬하고 명확한 문장 (글자 수 계산 표시)
   - threads: 쓰레드(Threads)용. 자연스럽고 솔직한 공감형 대화체 (친구에게 털어놓듯 편안한 어투)

4. 💡 AI 활용 확장 문구 (part4)
   - bookClubQuestions: 독서 모임에서 회원들과 깊은 사유와 경험을 나눌 수 있는 수준 높은 발제문 질문 2가지
   - calligraphyQuote: 손글씨나 캘리그라피로 다이어리에 적어두고 싶은 한 줄 명언/문구
   - kakaoRecommendation: 소중한 지인에게 마음을 담아 카카오톡으로 책을 선물하거나 추천할 때 보낼 수 있는 다정하고 따뜻한 메시지
`;

    const userPrompt = `
다음 도서에 대한 독서 리뷰와 소셜 미디어 문구를 생성해주세요:

- 책 제목: ${title}
${author ? `- 저자/출판사: ${author}` : ''}
${genre ? `- 장르/분야: ${genre}` : ''}
${quote ? `- 사용자가 인상 깊었던 구절:\n"${quote}"` : '- 사용자가 입력한 구절: (제공되지 않음 -> 해당 책에서 가장 울림이 큰 구절이나 핵심 테마를 AI가 직접 발췌하여 보완해주세요)'}
${personalReview ? `- 사용자의 감상평 및 생각:\n"${personalReview}"` : '- 사용자의 감상평: (제공되지 않음 -> 책이 전하는 메시지와 일상적 울림을 토대로 AI가 정성스럽게 보완해주세요)'}
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
                moodTag: { type: Type.STRING, description: '예: #치유 #사유 #따뜻한위로' },
                aiSupplementedNote: {
                  type: Type.STRING,
                  description: 'AI가 보완한 책의 주요 배경이나 특징 한 줄 안내',
                },
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
                  description: '정확히 3개의 명확하고 강렬한 리뷰 문장',
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
              required: [
                'catchyTitle',
                'intro',
                'coreThemeAndPlot',
                'personalThoughts',
                'recommendedTarget',
                'fullMarkdownContent',
              ],
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
                    text: { type: Type.STRING, description: '140자 이내 문장' },
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
                  description: '독서 모임 발제문 질문 2가지',
                },
                calligraphyQuote: {
                  type: Type.STRING,
                  description: '손글씨/캘리그라피로 적기 좋은 한 줄 명언',
                },
                kakaoRecommendation: {
                  type: Type.STRING,
                  description: '지인에게 보낼 카카오톡 추천 메시지',
                },
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
      throw new Error('Gemini API로부터 응답을 받지 못했습니다.');
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error('리뷰 생성 오류:', error);
    return res.status(500).json({
      error: error.message || '리뷰 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
});

// Vite 미들웨어 및 정적 서빙
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`🚀 북스파크 서버가 포트 ${port}에서 실행 중입니다.`);
  });
}

startServer();
