import { useState, useRef } from 'react';
import { Palette, Download, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface CalligraphyCardProps {
  quote: string;
  bookTitle: string;
  author?: string;
}

export function CalligraphyCard({ quote, bookTitle, author }: CalligraphyCardProps) {
  const [theme, setTheme] = useState<'paper' | 'midnight' | 'forest' | 'sunset'>('paper');
  const [fontStyle, setFontStyle] = useState<'serif' | 'clean'>('serif');
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const themeStyles = {
    paper: {
      bg: 'bg-[#fdfbf7] border-[#e8decb]',
      text: 'text-stone-900',
      subtext: 'text-stone-600',
      accent: 'border-amber-700/30',
      badge: 'bg-amber-100 text-amber-900',
    },
    midnight: {
      bg: 'bg-gradient-to-br from-stone-900 via-slate-900 to-zinc-950 border-stone-800 text-white',
      text: 'text-stone-100',
      subtext: 'text-stone-400',
      accent: 'border-amber-400/30',
      badge: 'bg-stone-800 text-amber-200',
    },
    forest: {
      bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border-emerald-900 text-white',
      text: 'text-emerald-50',
      subtext: 'text-emerald-300/80',
      accent: 'border-emerald-500/30',
      badge: 'bg-emerald-900/60 text-emerald-200',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-amber-900 via-orange-950 to-stone-950 border-orange-900 text-white',
      text: 'text-amber-50',
      subtext: 'text-orange-200/80',
      accent: 'border-orange-500/30',
      badge: 'bg-amber-950/60 text-amber-200',
    },
  };

  const currentTheme = themeStyles[theme];

  // Canvas-based download of the literary postcard
  const handleDownloadImage = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw background
      if (theme === 'paper') {
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, 1080, 1080);
        // Border outline
        ctx.strokeStyle = '#d7ccb8';
        ctx.lineWidth = 12;
        ctx.strokeRect(40, 40, 1000, 1000);
      } else if (theme === 'midnight') {
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);
      } else if (theme === 'forest') {
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#7c2d12');
        grad.addColorStop(1, '#1c1917');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);
      }

      // Decorative quotes
      ctx.fillStyle = theme === 'paper' ? '#92400e' : '#fef08a';
      ctx.font = 'bold 80px serif';
      ctx.textAlign = 'center';
      ctx.fillText('“', 540, 240);

      // Quote text
      ctx.fillStyle = theme === 'paper' ? '#1c1917' : '#ffffff';
      ctx.font = fontStyle === 'serif' ? 'bold 44px "Nanum Myeongjo", serif' : 'bold 42px "Pretendard", sans-serif';

      // Simple word wrapping
      const words = quote.split(' ');
      let line = '';
      let y = 380;
      const maxWidth = 860;
      const lineHeight = 68;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), 540, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 540, y);

      // Divider line
      y += 80;
      ctx.strokeStyle = theme === 'paper' ? '#d7ccb8' : '#52525b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(440, y);
      ctx.lineTo(640, y);
      ctx.stroke();

      // Book & Author
      y += 60;
      ctx.font = '28px "Nanum Myeongjo", serif';
      ctx.fillStyle = theme === 'paper' ? '#44403c' : '#d4d4d8';
      ctx.fillText(`《${bookTitle}》`, 540, y);

      if (author) {
        y += 44;
        ctx.font = '22px "Pretendard", sans-serif';
        ctx.fillStyle = theme === 'paper' ? '#78716c' : '#a1a1aa';
        ctx.fillText(author, 540, y);
      }

      // Footer branding
      ctx.font = '18px "Pretendard", sans-serif';
      ctx.fillStyle = theme === 'paper' ? '#a8a29e' : '#71717a';
      ctx.fillText('BookSpark AI · 문장의 여운을 담다', 540, 1000);

      const link = document.createElement('a');
      link.download = `${bookTitle}_캘리그라피_카드.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (e) {
      console.error('이미지 생성 오류:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-base font-bold text-stone-900 font-serif-kr flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-amber-700" />
            캘리그라피 감성 엽서 카드 제작기
          </h3>
          <p className="text-xs text-stone-500">
            책 속 가장 찬란한 문장을 SNS와 메신저에 공유할 수 있는 감성 카드로 완성합니다
          </p>
        </div>

        {/* Style Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Themes */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            {[
              { id: 'paper', label: '미색 한지' },
              { id: 'midnight', label: '자정' },
              { id: 'forest', label: '숲' },
              { id: 'sunset', label: '노을' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as any)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  theme === t.id
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Font Toggle */}
          <button
            type="button"
            onClick={() => setFontStyle(fontStyle === 'serif' ? 'clean' : 'serif')}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium transition cursor-pointer"
          >
            {fontStyle === 'serif' ? '🖋️ 명조체' : '📱 고딕체'}
          </button>
        </div>
      </div>

      {/* Card Preview Container */}
      <div className="flex flex-col items-center">
        <div
          ref={cardRef}
          className={`w-full max-w-lg aspect-square rounded-2xl p-7 sm:p-10 border shadow-md flex flex-col justify-between items-center text-center transition-all duration-300 relative overflow-hidden ${currentTheme.bg}`}
        >
          {/* Subtle watermark/accent */}
          <div className="text-4xl text-amber-600/40 font-serif select-none">“</div>

          {/* Main Quote */}
          <div className="my-auto px-2">
            <p
              className={`text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed tracking-wide ${
                fontStyle === 'serif' ? 'font-serif-kr' : 'font-sans-kr'
              } ${currentTheme.text}`}
            >
              {quote}
            </p>
          </div>

          {/* Book Info Footer */}
          <div className="w-full pt-4 border-t border-current/15 flex flex-col items-center">
            <div
              className={`text-sm sm:text-base font-bold font-serif-kr ${currentTheme.text}`}
            >
              《{bookTitle}》
            </div>
            {author && (
              <div className={`text-xs mt-0.5 ${currentTheme.subtext}`}>{author}</div>
            )}
            <div className="text-[10px] opacity-40 mt-3 font-mono">BookSpark AI</div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>저장 완료!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>카드 이미지 다운로드 (1080x1080)</span>
              </>
            )}
          </button>
          <CopyButton textToCopy={`"${quote}"\n\n— 《${bookTitle}》 중에서`} label="문구 복사" size="sm" />
        </div>
      </div>
    </div>
  );
}
