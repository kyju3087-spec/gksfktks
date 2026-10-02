import { Users, PenTool, MessageSquareShare, Sparkles, Send, Heart } from 'lucide-react';
import type { ReviewPart4Extension } from '../types/book';
import { CopyButton } from './CopyButton';

interface Part4ExtensionsProps {
  data: ReviewPart4Extension;
  bookTitle: string;
  onOpenCalligraphyStudio?: () => void;
}

export function Part4Extensions({
  data,
  bookTitle,
  onOpenCalligraphyStudio,
}: Part4ExtensionsProps) {
  const fullExtensionText = `[💡 ${bookTitle} AI 활용 확장 문구]

■ 독서 모임 발제문 (2가지):
Q1. ${data.bookClubQuestions[0]}
Q2. ${data.bookClubQuestions[1]}

■ 캘리그라피 / 필사 한 줄 명언:
"${data.calligraphyQuote}"

■ 지인 카카오톡 책 추천 메시지:
${data.kakaoRecommendation}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-amber-50/40 px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-kr">
              4. 💡 AI 활용 확장 문구 (독서 모임 · 캘리그라피 · 카톡 추천)
            </h3>
            <p className="text-xs text-stone-500">
              사유를 나누고 마음에 담아 전하는 다채로운 활용법
            </p>
          </div>
        </div>

        <CopyButton textToCopy={fullExtensionText} label="확장 문구 전체 복사" size="sm" />
      </div>

      <div className="p-5 sm:p-7 space-y-7">
        {/* 1. Book Club Questions (독서 모임 발제문) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              독서 모임 발제문 질문 (2가지)
            </span>
            <CopyButton
              textToCopy={`[독서 모임 발제문 - ${bookTitle}]\n\nQ1. ${data.bookClubQuestions[0]}\n\nQ2. ${data.bookClubQuestions[1]}`}
              label="질문 2개 복사"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.bookClubQuestions.map((question, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/30 hover:bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md mb-2">
                    질문 0{idx + 1}
                  </div>
                  <p className="text-sm text-stone-800 font-sans-kr leading-relaxed font-medium">
                    {question}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-100 flex justify-end">
                  <CopyButton textToCopy={question} variant="ghost" size="sm" label="질문 복사" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Calligraphy / One-line Quote */}
        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-amber-700" />
              손글씨 / 캘리그라피로 적기 좋은 한 줄 명언
            </span>
            <div className="flex items-center gap-2">
              {onOpenCalligraphyStudio && (
                <button
                  type="button"
                  onClick={onOpenCalligraphyStudio}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2 transition"
                >
                  감성 엽서 카드로 보기 →
                </button>
              )}
              <CopyButton textToCopy={data.calligraphyQuote} size="sm" label="한 줄 복사" />
            </div>
          </div>

          <div className="bg-white/80 p-5 rounded-xl border border-amber-200/60 text-center shadow-2xs">
            <p className="text-base sm:text-lg text-stone-900 font-serif-kr font-semibold leading-relaxed tracking-wide">
              "{data.calligraphyQuote}"
            </p>
            <p className="text-xs text-stone-400 mt-2 font-serif-kr">— 《{bookTitle}》 중에서</p>
          </div>
        </div>

        {/* 3. KakaoTalk Book Recommendation Message */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareShare className="w-4 h-4 text-amber-700" />
              지인에게 책을 선물/추천하며 보내는 카카오톡 메시지
            </span>
            <CopyButton
              textToCopy={data.kakaoRecommendation}
              label="카톡 문구 복사"
              size="sm"
              variant="primary"
            />
          </div>

          {/* Kakao UI Card Mockup */}
          <div className="bg-[#b2c7d9] p-4 sm:p-5 rounded-2xl border border-stone-300/80 shadow-2xs max-w-xl mx-auto">
            <div className="flex items-start gap-2.5">
              {/* Profile icon */}
              <div className="w-9 h-9 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                나
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-stone-800 mb-1">
                  나의 다정한 추천
                </div>
                {/* Kakao Speech Bubble */}
                <div className="relative bg-[#feeb47] text-stone-900 p-3.5 sm:p-4 rounded-xl rounded-tl-xs shadow-xs text-sm leading-relaxed whitespace-pre-line font-sans-kr max-w-md">
                  {data.kakaoRecommendation}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-1 pl-1">
                  <span>방금 전</span>
                  <span>·</span>
                  <span className="text-emerald-800 font-medium">따뜻한 마음 전달</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
