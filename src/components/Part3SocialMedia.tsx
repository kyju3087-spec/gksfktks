import { useState } from 'react';
import { Smartphone, Instagram, Twitter, MessageCircle, Hash, ExternalLink, Sparkles } from 'lucide-react';
import type { ReviewPart3Social } from '../types/book';
import { CopyButton } from './CopyButton';

interface Part3SocialMediaProps {
  data: ReviewPart3Social;
  bookTitle: string;
}

export function Part3SocialMedia({ data, bookTitle }: Part3SocialMediaProps) {
  const [activeTab, setActiveTab] = useState<'instagram' | 'twitter' | 'threads'>('instagram');

  const instagramFullCopy = `${data.instagram.title}

${data.instagram.caption}

📌 책 속 한 줄 요약:
${data.instagram.cardSlideQuotes.map((q, i) => `${i + 1}. "${q}"`).join('\n')}

.
.
${data.instagram.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;

  const twitterCopy = data.twitter.text;
  const threadsCopy = data.threads.post;

  const handleShareTwitter = () => {
    const encoded = encodeURIComponent(data.twitter.text);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50/40 via-purple-50/30 to-sky-50/40 px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-kr">
              3. 📱 소셜 미디어 맞춤형 숏폼 문구
            </h3>
            <p className="text-xs text-stone-500">
              인스타그램 카드뉴스 · X(트위터) 140자 · 쓰레드(Threads) 공감형
            </p>
          </div>
        </div>

        {/* Global tab copy */}
        <CopyButton
          textToCopy={
            activeTab === 'instagram'
              ? instagramFullCopy
              : activeTab === 'twitter'
              ? twitterCopy
              : threadsCopy
          }
          label={`${activeTab === 'instagram' ? '인스타' : activeTab === 'twitter' ? 'X' : '쓰레드'} 복사`}
          size="sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-stone-50/60 p-1.5 gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('instagram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'instagram'
              ? 'bg-white text-pink-600 shadow-xs border border-pink-100'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Instagram className="w-4 h-4 text-pink-500" />
          <span>인스타그램 (카드뉴스/캡션)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('twitter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'twitter'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span className="font-bold text-xs">𝕏</span>
          <span>트위터 / X (140자 이내)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('threads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            activeTab === 'threads'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-amber-800" />
          <span>쓰레드 Threads (대화체)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-7">
        {/* Instagram Tab */}
        {activeTab === 'instagram' && (
          <div className="space-y-6">
            {/* Card News Slide Quote Previews */}
            {data.instagram.cardSlideQuotes && data.instagram.cardSlideQuotes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    카드뉴스 슬라이드별 핵심 문구
                  </span>
                  <span className="text-[11px] text-stone-400">인스타 카드뉴스 제작 시 바로 활용</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.instagram.cardSlideQuotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-pink-50/50 via-white to-amber-50/30 border border-pink-100 rounded-xl p-3.5 flex flex-col justify-between"
                    >
                      <div className="text-[11px] font-bold text-pink-600 mb-1">
                        슬라이드 {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 font-serif-kr italic">
                        "{quote}"
                      </p>
                      <div className="mt-2 pt-2 border-t border-pink-100/60 flex justify-end">
                        <CopyButton textToCopy={quote} variant="ghost" size="sm" label="문구 복사" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Caption */}
            <div className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700">인스타그램 본문 캡션</span>
                <CopyButton textToCopy={data.instagram.caption} label="본문만 복사" size="sm" />
              </div>
              <p className="text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans-kr">
                {data.instagram.caption}
              </p>
            </div>

            {/* Hashtags */}
            <div className="bg-pink-50/30 rounded-xl p-4 border border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-900 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-pink-600" />
                  맞춤 인기 해시태그 (5~8개)
                </span>
                <CopyButton
                  textToCopy={data.instagram.hashtags
                    .map((h) => (h.startsWith('#') ? h : `#${h}`))
                    .join(' ')}
                  label="해시태그 전체 복사"
                  size="sm"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.instagram.hashtags.map((h, i) => {
                  const tag = h.startsWith('#') ? h : `#${h}`;
                  return (
                    <span
                      key={i}
                      className="text-xs bg-white text-pink-700 font-medium px-2.5 py-1 rounded-lg border border-pink-200/80 shadow-2xs"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Twitter / X Tab */}
        {activeTab === 'twitter' && (
          <div className="space-y-4">
            <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/50 shadow-2xs">
              {/* Mock Tweet Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                    𝕏
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1">
                      독서가
                      <span className="text-xs text-stone-400 font-normal">@bookspark · 방금 전</span>
                    </div>
                  </div>
                </div>

                {/* Character Count Badge */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                      data.twitter.text.length <= 140
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {data.twitter.text.length} / 140자
                  </span>
                </div>
              </div>

              {/* Tweet Content */}
              <p className="text-base sm:text-lg text-stone-900 font-sans-kr leading-relaxed my-3 font-normal">
                {data.twitter.text}
              </p>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-400">
                  강렬한 한 방으로 타임라인을 사로잡는 문장
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton textToCopy={data.twitter.text} label="트윗 복사" size="sm" />
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    <span>𝕏 에 올리기</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threads Tab */}
        {activeTab === 'threads' && (
          <div className="space-y-4">
            <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/50 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-800 to-stone-900 text-white flex items-center justify-center font-bold text-xs">
                  🧵
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">
                    책 읽는 일상
                    <span className="text-xs text-stone-400 font-normal ml-1.5">Threads</span>
                  </div>
                  <div className="text-[11px] text-stone-400">자연스럽고 편안한 대화체 피드</div>
                </div>
              </div>

              <div className="text-sm sm:text-base text-stone-800 whitespace-pre-line leading-relaxed font-sans-kr bg-white p-4 rounded-xl border border-stone-200/80">
                {data.threads.post}
              </div>

              <div className="pt-3 flex justify-end">
                <CopyButton
                  textToCopy={data.threads.post}
                  label="쓰레드 문구 복사"
                  variant="primary"
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
