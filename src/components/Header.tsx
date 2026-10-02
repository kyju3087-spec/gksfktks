import { BookOpen, Sparkles, Bookmark, Database } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenLibrary: () => void;
}

export function Header({ savedCount, onOpenLibrary }: HeaderProps) {
  return (
    <header className="border-b border-stone-200/80 bg-[#fdfbf7]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-amber-50 flex items-center justify-center shadow-md shadow-amber-900/10 ring-1 ring-amber-950/20">
            <BookOpen className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-serif-kr flex items-center gap-1.5">
                북스파크
                <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200/60">
                  BookSpark AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              책 요약 · 3줄 리뷰 · 블로그/노션 · SNS 맞춤형 문구 원스톱 생성기
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Firebase Connection Pill */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-100/90 border border-stone-200/70 px-2.5 py-1 rounded-full">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px] text-stone-600">Firebase Firestore</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Saved Reviews Button */}
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 active:bg-stone-300/80 border border-stone-200 transition shadow-2xs"
          >
            <Bookmark className="w-4 h-4 text-amber-700" />
            <span>내 독서 서재</span>
            {savedCount > 0 && (
              <span className="bg-amber-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
