import { useState } from 'react';
import { Sparkles, BookOpen, Quote, MessageSquare, Feather, RefreshCw, Layers } from 'lucide-react';
import type { BookInput } from '../types/book';
import { SAMPLE_BOOKS } from '../data/sampleBooks';

interface BookInputFormProps {
  onSubmit: (input: BookInput) => void;
  isLoading: boolean;
}

export function BookInputForm({ onSubmit, isLoading }: BookInputFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [quote, setQuote] = useState('');
  const [personalReview, setPersonalReview] = useState('');
  const [tone, setTone] = useState<BookInput['tone']>('warm');

  const handleApplySample = (sample: typeof SAMPLE_BOOKS[0]) => {
    setTitle(sample.title);
    setAuthor(sample.author || '');
    setGenre(sample.genre || '');
    setQuote(sample.quote || '');
    setPersonalReview(sample.personalReview || '');
    setTone(sample.tone || 'warm');
  };

  const handleClear = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setQuote('');
    setPersonalReview('');
    setTone('warm');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      author: author.trim() || undefined,
      genre: genre.trim() || undefined,
      quote: quote.trim() || undefined,
      personalReview: personalReview.trim() || undefined,
      tone,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7 transition-all">
      {/* Quick Sample Presets */}
      <div className="mb-6 pb-5 border-b border-stone-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            추천 도서 샘플로 즉시 테스트해보기
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-stone-400 hover:text-stone-700 underline underline-offset-2 transition"
          >
            입력 초기화
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_BOOKS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(s)}
              className="group text-left text-xs bg-stone-50 hover:bg-amber-50/80 active:bg-amber-100/80 border border-stone-200/70 hover:border-amber-300 rounded-xl px-3 py-2 transition-all shadow-2xs flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-md bg-stone-200 group-hover:bg-amber-200 flex items-center justify-center text-stone-700 group-hover:text-amber-900 font-serif-kr text-[11px] font-bold">
                {s.title[0]}
              </div>
              <div>
                <div className="font-semibold text-stone-800 group-hover:text-amber-950 flex items-center gap-1.5">
                  <span>{s.title}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-normal">
                    {s.badge}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate max-w-[150px] sm:max-w-[200px]">
                  {s.author}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Book Title & Author row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              책 제목 <span className="text-amber-700 font-bold">*필수</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 작별하지 않는다, 불편한 편의점, 데미안"
                className="w-full px-3.5 py-2.5 bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-stone-900 text-sm transition outline-none"
              />
              <BookOpen className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              저자 / 출판사 <span className="text-stone-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="예: 한강, 문학동네"
              className="w-full px-3.5 py-2.5 bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-stone-900 text-sm transition outline-none"
            />
          </div>
        </div>

        {/* Genre & Tone row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              장르 / 카테고리 <span className="text-stone-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="예: 한국문학, 에세이, 자기계발"
              className="w-full px-3.5 py-2 bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-stone-900 text-sm transition outline-none"
            />
          </div>

          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              리뷰 문체 & 어조 톤
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'warm', label: '따뜻한 감성', sub: '~합니다, ~해요' },
                { id: 'intellectual', label: '지적 사유', sub: '~입니다, ~합니다' },
                { id: 'conversational', label: '친근한 대화', sub: '카페 수다 느낌' },
                { id: 'poetic', label: '서정적 여운', sub: '은유와 감성' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                    tone === t.id
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500/30'
                      : 'bg-stone-50/80 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[10px] text-stone-400 truncate">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Memorable Quotes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-700" />
              인상 깊었던 구절 / 인용 문장 <span className="text-stone-400 font-normal">(선택)</span>
            </label>
            <span className="text-[11px] text-amber-800/80 bg-amber-50 px-2 py-0.5 rounded font-normal">
              💡 비워두셔도 AI가 대표 명문장을 자동 발췌합니다
            </span>
          </div>
          <textarea
            rows={2}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="책에서 가슴을 울렸던 문장이나 기억하고 싶은 구절을 적어주세요."
            className="w-full px-3.5 py-2.5 bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-stone-900 text-sm transition outline-none resize-y"
          />
        </div>

        {/* Personal Review */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              나만의 감상평 & 키워드 <span className="text-stone-400 font-normal">(선택)</span>
            </label>
            <span className="text-[11px] text-stone-400 font-normal">
              짧은 메모나 단어 하나여도 좋습니다
            </span>
          </div>
          <textarea
            rows={3}
            value={personalReview}
            onChange={(e) => setPersonalReview(e.target.value)}
            placeholder="책을 읽고 느낀 점, 떠오른 경험, 좋았던 이유를 편하게 메모해보세요. (비워두셔도 책의 본질을 살려 감상평을 구성합니다)"
            className="w-full px-3.5 py-2.5 bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-stone-900 text-sm transition outline-none resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 hover:from-amber-800 hover:to-black active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-950/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-200" />
                <span>책의 온기를 문장으로 엮어내고 있어요...</span>
              </>
            ) : (
              <>
                <Feather className="w-5 h-5 text-amber-300" />
                <span>독서 리뷰 & 4대 목적별 문구 생성하기</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-stone-400 mt-2">
            요약 3줄 · 블로그/노션 글 · SNS 숏폼(인스타/X/스레드) · 발제문&캘리그라피 원스톱 생성
          </p>
        </div>
      </form>
    </div>
  );
}
