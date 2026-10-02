import { useState } from 'react';
import { PenTool, FileText, Code2, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import type { ReviewPart2Long } from '../types/book';
import { CopyButton } from './CopyButton';

interface Part2LongReviewProps {
  data: ReviewPart2Long;
  bookTitle: string;
}

export function Part2LongReview({ data, bookTitle }: Part2LongReviewProps) {
  const [viewMode, setViewMode] = useState<'reading' | 'markdown'>('reading');

  const plainTextToCopy = `${data.catchyTitle}

[도서: ${bookTitle}]

1. 서두
${data.intro}

2. 줄거리 및 테마
${data.coreThemeAndPlot}

3. 개인적인 생각과 소회
${data.personalThoughts}

4. 이런 분들께 추천합니다
${data.recommendedTarget}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 px-5 py-4 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-200 flex items-center justify-center shadow-xs">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-kr">
              2. ✍️ 감성 블로그/노션용 긴 리뷰
            </h3>
            <p className="text-xs text-stone-500">
              몰입감 있는 서두부터 추천 대상까지 완성도 높은 글
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between reading mode and markdown mode */}
          <div className="bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs flex">
            <button
              type="button"
              onClick={() => setViewMode('reading')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                viewMode === 'reading'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              읽기 뷰
            </button>
            <button
              type="button"
              onClick={() => setViewMode('markdown')}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                viewMode === 'markdown'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Code2 className="w-3 h-3" />
              마크다운
            </button>
          </div>

          <CopyButton
            textToCopy={data.fullMarkdownContent || plainTextToCopy}
            label="노션/블로그 복사"
            size="sm"
            variant="primary"
          />
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {viewMode === 'reading' ? (
          <article className="space-y-6 max-w-none">
            {/* Catchy Post Title */}
            <div className="border-b border-stone-100 pb-5">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1 block">
                블로그 / 노션 추천 제목
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-kr leading-snug">
                {data.catchyTitle}
              </h2>
            </div>

            {/* Intro */}
            <section className="bg-amber-50/20 rounded-xl p-4 sm:p-5 border-l-4 border-amber-500">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                서두 (여는 글)
              </h4>
              <p className="text-stone-700 leading-relaxed font-serif-kr text-sm sm:text-base whitespace-pre-line">
                {data.intro}
              </p>
            </section>

            {/* Core Theme & Plot */}
            <section className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                줄거리 및 핵심 사유
              </h4>
              <div className="text-stone-800 leading-relaxed font-sans-kr text-sm sm:text-base whitespace-pre-line bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                {data.coreThemeAndPlot}
              </div>
            </section>

            {/* Personal Reflections */}
            <section className="space-y-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                나만의 소회와 사색
              </h4>
              <div className="text-stone-800 leading-relaxed font-serif-kr text-sm sm:text-base whitespace-pre-line bg-orange-50/30 p-4 rounded-xl border border-orange-100/60 italic">
                {data.personalThoughts}
              </div>
            </section>

            {/* Recommended Target */}
            <section className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200/70">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                이런 분들께 권해드립니다
              </h4>
              <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-sans-kr">
                {data.recommendedTarget}
              </div>
            </section>
          </article>
        ) : (
          /* Raw Markdown View */
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-500 font-mono">
                Notion, GitHub, Velog, Tistory 등 마크다운 지원 에디터에 바로 붙여넣기 하세요.
              </span>
              <CopyButton
                textToCopy={data.fullMarkdownContent}
                label="마크다운 복사"
                size="sm"
              />
            </div>
            <pre className="bg-stone-900 text-stone-100 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
              {data.fullMarkdownContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
