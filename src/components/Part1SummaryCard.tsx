import { BookOpen, CheckCircle2, Copy } from 'lucide-react';
import type { ReviewPart1Summary } from '../types/book';
import { CopyButton } from './CopyButton';

interface Part1SummaryCardProps {
  data: ReviewPart1Summary;
  bookTitle: string;
}

export function Part1SummaryCard({ data, bookTitle }: Part1SummaryCardProps) {
  const fullTextToCopy = `[📖 ${bookTitle} 핵심 요약 & 3줄 리뷰]

■ 핵심 요약:
${data.coreSummary}

■ 3줄 리뷰:
1. ${data.threeLineReview[0]}
2. ${data.threeLineReview[1]}
3. ${data.threeLineReview[2]}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/40 px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-kr">
              1. 📖 책 핵심 요약 & 3줄 리뷰
            </h3>
            <p className="text-xs text-stone-500">
              책의 중심 메시지와 한눈에 각인되는 3줄 요약
            </p>
          </div>
        </div>
        <CopyButton textToCopy={fullTextToCopy} label="요약 전체 복사" size="sm" />
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Core Summary */}
        <div className="bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/70">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900/80 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            도서 핵심 요약
          </div>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans-kr">
            {data.coreSummary}
          </p>
        </div>

        {/* 3-line Review */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
            <span>핵심 3줄 리뷰</span>
            <span className="text-[11px] text-amber-700 font-normal">한 줄씩 터치하여 복사 가능</span>
          </div>

          <div className="space-y-2.5">
            {data.threeLineReview.map((line, idx) => (
              <div
                key={idx}
                className="group relative bg-amber-50/40 hover:bg-amber-50/80 border border-amber-200/60 rounded-xl p-3.5 sm:p-4 transition-all flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-amber-600/90 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {idx + 1}
                </div>
                <div className="flex-1 text-sm sm:text-base text-stone-800 font-medium font-serif-kr leading-relaxed">
                  {line}
                </div>
                <CopyButton
                  textToCopy={line}
                  variant="icon-only"
                  size="sm"
                  className="opacity-60 group-hover:opacity-100 transition shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
