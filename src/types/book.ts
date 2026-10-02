export interface BookInput {
  title: string;
  author?: string;
  quote?: string;
  personalReview?: string;
  tone?: 'warm' | 'intellectual' | 'conversational' | 'poetic';
  genre?: string;
}

export interface ReviewPart1Summary {
  coreSummary: string; // 책의 핵심 메시지 및 줄거리 요약
  threeLineReview: [string, string, string]; // 3줄 리뷰
}

export interface ReviewPart2Long {
  catchyTitle: string; // 블로그/노션용 매력적인 제목
  intro: string; // 몰입감 넘치는 감성적 서두
  coreThemeAndPlot: string; // 핵심 줄거리 & 전개되는 사유
  personalThoughts: string; // 개인적 소회와 내 삶에 닿은 지점
  recommendedTarget: string; // 이런 분들께 추천합니다
  fullMarkdownContent: string; // 블로그/노션 바로 복사용 전체 마크다운
}

export interface ReviewPart3Social {
  instagram: {
    title: string;
    caption: string;
    cardSlideQuotes: string[]; // 카드뉴스용 3~4 슬라이드 문구
    hashtags: string[]; // 5~8개 해시태그
  };
  twitter: {
    text: string; // 140자 이내 강렬한 문장
    charCount: number;
  };
  threads: {
    post: string; // 공감형 대화체
  };
}

export interface ReviewPart4Extension {
  bookClubQuestions: [string, string]; // 독서 모임 발제문 질문 2가지
  calligraphyQuote: string; // 손글씨/캘리그라피로 적기 좋은 한 줄 명언/문구
  kakaoRecommendation: string; // 지인에게 책을 추천하며 보내는 카카오톡 메시지
}

export interface GeneratedReviewData {
  id?: string;
  createdAt?: string;
  bookInfo: {
    title: string;
    author: string;
    genre?: string;
    moodTag?: string;
    aiSupplementedNote?: string; // 사용자가 적게 썼을 때 AI가 보완한 책 배경 설명
  };
  part1: ReviewPart1Summary;
  part2: ReviewPart2Long;
  part3: ReviewPart3Social;
  part4: ReviewPart4Extension;
}

export interface SavedReviewRecord extends GeneratedReviewData {
  id: string;
  createdAt: string;
  isBookmarked?: boolean;
}
