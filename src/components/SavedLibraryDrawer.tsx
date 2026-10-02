import { useState } from 'react';
import { X, Trash2, BookOpen, Search, ArrowRight, ExternalLink, Database, Calendar } from 'lucide-react';
import type { SavedReviewRecord } from '../types/book';

interface SavedLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedReviews: SavedReviewRecord[];
  onSelectReview: (review: SavedReviewRecord) => void;
  onDeleteReview: (id: string) => void;
}

export function SavedLibraryDrawer({
  isOpen,
  onClose,
  savedReviews,
  onSelectReview,
  onDeleteReview,
}: SavedLibraryDrawerProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = savedReviews.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.bookInfo.title.toLowerCase().includes(term) ||
      (r.bookInfo.author && r.bookInfo.author.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 bg-[#fdfbf7] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-amber-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 font-serif-kr text-base">
                  내 독서 서재
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Firebase Firestore 동기화</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="도서명 또는 저자 검색..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-stone-700">저장된 독서 기록이 없습니다.</p>
                <p className="text-xs text-stone-400 mt-1">
                  리뷰를 생성한 후 '서재에 저장' 버튼을 누르면 이곳에 영구 보관됩니다.
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="group bg-stone-50/70 hover:bg-amber-50/50 border border-stone-200/80 hover:border-amber-300 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-stone-900 font-serif-kr text-sm group-hover:text-amber-950">
                        {item.bookInfo.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {item.bookInfo.author || '저자 정보 없음'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteReview(item.id)}
                      className="p-1.5 text-stone-300 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 font-sans-kr leading-relaxed">
                    {item.part1.coreSummary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectReview(item);
                        onClose();
                      }}
                      className="text-amber-800 font-semibold flex items-center gap-1 hover:text-amber-950 transition"
                    >
                      <span>리뷰 불러오기</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
