import { useState } from 'react';
import {
  Bookmark,
  Share2,
  Copy,
  Sparkles,
  Layers,
  BookOpen,
  PenTool,
  Smartphone,
  Check,
  Palette,
} from 'lucide-react';
import type { GeneratedReviewData } from '../types/book';
import { Part1SummaryCard } from './Part1SummaryCard';
import { Part2LongReview } from './Part2LongReview';
import { Part3SocialMedia } from './Part3SocialMedia';
import { Part4Extensions } from './Part4Extensions';
import { CalligraphyCard } from './CalligraphyCard';
import { CopyButton } from './CopyButton';

interface ReviewDisplayProps {
  data: GeneratedReviewData;
  onSaveToLibrary: (data: GeneratedReviewData) => void;
  isSaved?: boolean;
}

export function ReviewDisplay({ data, onSaveToLibrary, isSaved }: ReviewDisplayProps) {
  const [activeTab, setActiveTab] = useState<
    'all' | 'part1' | 'part2' | 'part3' | 'part4' | 'calligraphy'
  >('all');

  // Master text combining all 4 parts
  const fullComprehensiveText = `================================================
📚 [도서 리뷰 & 소셜 문구] 《${data.bookInfo.title}》
저자: ${data.bookInfo.author || '미지정'}
================================================

1. 📖 책 핵심 요약 & 3줄 리뷰
------------------------------------------------
[핵심 요약]
${data.part1.coreSummary}

[3줄 리뷰]
1. ${data.part1.threeLineReview[0]}
2. ${data.part1.threeLineReview[1]}
3. ${data.part1.threeLineReview[2]}


2. ✍️ 감성 블로그/노션용 긴 리뷰
------------------------------------------------
${data.part2.fullMarkdownContent}


3. 📱 소셜 미디어 맞춤형 숏폼 문구
------------------------------------------------
[인스타그램 캡션 & 해시태그]
${data.part3.instagram.caption}

해시태그: ${data.part3.instagram.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

[트위터 / X (140자 이내)]
${data.part3.twitter.text}

[쓰레드 Threads (공감형 대화체)]
${data.part3.threads.post}


4. 💡 AI 활용 확장 문구
------------------------------------------------
[독서 모임 발제문 질문 2가지]
Q1. ${data.part4.bookClubQuestions[0]}
Q2. ${data.part4.bookClubQuestions[1]}

[손글씨 / 캘리그라피 한 줄 명언]
"${data.part4.calligraphyQuote}"

[지인 카카오톡 책 추천 메시지]
${data.part4.kakaoRecommendation}
`;

  return (
    <div className="space-y-6 transition-all">
      {/* Book Info Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-7 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                {data.bookInfo.genre || '도서 리뷰'}
              </span>
              {data.bookInfo.moodTag && (
                <span className="text-xs text-stone-500 font-medium">
                  {data.bookInfo.moodTag}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-kr tracking-tight">
              《{data.bookInfo.title}》
            </h2>

            {data.bookInfo.author && (
              <p className="text-sm font-medium text-stone-600 mt-1">
                {data.bookInfo.author}
              </p>
            )}

            {/* AI Supplemented Note */}
            {data.bookInfo.aiSupplementedNote && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/80 px-3 py-1 rounded-lg border border-amber-200/60 font-sans-kr">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{data.bookInfo.aiSupplementedNote}</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Save to library */}
            <button
              type="button"
              onClick={() => onSaveToLibrary(data)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-xs cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-900 hover:bg-black text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>서재에 저장됨</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-amber-300" />
                  <span>내 서재에 저장</span>
                </>
              )}
            </button>

            {/* Copy All Button */}
            <CopyButton
              textToCopy={fullComprehensiveText}
              label="전체 4개 파트 종합 복사"
              variant="secondary"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80 flex gap-1 overflow-x-auto shadow-2xs">
        {[
          { id: 'all', label: '전체 모아보기', icon: Layers },
          { id: 'part1', label: '1. 요약 & 3줄', icon: BookOpen },
          { id: 'part2', label: '2. 블로그/노션', icon: PenTool },
          { id: 'part3', label: '3. 소셜 숏폼', icon: Smartphone },
          { id: 'part4', label: '4. AI 확장 문구', icon: Sparkles },
          { id: 'calligraphy', label: '엽서 카드 제작기', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'part1') && (
          <Part1SummaryCard data={data.part1} bookTitle={data.bookInfo.title} />
        )}

        {(activeTab === 'all' || activeTab === 'part2') && (
          <Part2LongReview data={data.part2} bookTitle={data.bookInfo.title} />
        )}

        {(activeTab === 'all' || activeTab === 'part3') && (
          <Part3SocialMedia data={data.part3} bookTitle={data.bookInfo.title} />
        )}

        {(activeTab === 'all' || activeTab === 'part4') && (
          <Part4Extensions
            data={data.part4}
            bookTitle={data.bookInfo.title}
            onOpenCalligraphyStudio={() => setActiveTab('calligraphy')}
          />
        )}

        {(activeTab === 'all' || activeTab === 'calligraphy') && (
          <CalligraphyCard
            quote={data.part4.calligraphyQuote}
            bookTitle={data.bookInfo.title}
            author={data.bookInfo.author}
          />
        )}
      </div>
    </div>
  );
}
