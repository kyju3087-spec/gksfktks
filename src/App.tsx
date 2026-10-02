import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Feather, AlertCircle, BookmarkCheck, ArrowDown } from 'lucide-react';
import { Header } from './components/Header';
import { BookInputForm } from './components/BookInputForm';
import { ReviewDisplay } from './components/ReviewDisplay';
import { SavedLibraryDrawer } from './components/SavedLibraryDrawer';
import { generateBookReview } from './lib/geminiClient';
import {
  saveReviewToStorage,
  fetchSavedReviews,
  deleteReviewFromStorage,
} from './lib/firebase';
import type { BookInput, GeneratedReviewData, SavedReviewRecord } from './types/book';
import { SAMPLE_BOOKS } from './data/sampleBooks';

export default function App() {
  const [currentReview, setCurrentReview] = useState<GeneratedReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedReviews, setSavedReviews] = useState<SavedReviewRecord[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved reviews on initial mount
  useEffect(() => {
    async function loadData() {
      try {
        const list = await fetchSavedReviews();
        setSavedReviews(list);
      } catch (err) {
        console.error('서재 데이터 불러오기 실패:', err);
      }
    }
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGenerate = async (input: BookInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const result = await generateBookReview(input);
      setCurrentReview(result);

      // Trigger celebratory literary confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#b45309', '#d97706', '#f59e0b', '#047857', '#1c1917'],
        });
      } catch (_) {}

      // Smooth scroll down to review
      setTimeout(() => {
        const el = document.getElementById('review-result-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error('리뷰 생성 실패:', err);
      setErrorMessage(
        err.message || '리뷰 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = async (review: GeneratedReviewData) => {
    try {
      const saved = await saveReviewToStorage(review);
      setSavedReviews((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setIsSaved(true);
      triggerToast('책 리뷰가 내 서재에 안전하게 저장되었습니다!');
    } catch (err) {
      console.error('저장 실패:', err);
      triggerToast('저장 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteSavedReview = async (id: string) => {
    try {
      await deleteReviewFromStorage(id);
      setSavedReviews((prev) => prev.filter((item) => item.id !== id));
      triggerToast('독서 기록이 삭제되었습니다.');
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const handleSelectSavedReview = (review: SavedReviewRecord) => {
    setCurrentReview(review);
    setIsSaved(true);
    triggerToast(`《${review.bookInfo.title}》 기록을 불러왔습니다.`);
    setTimeout(() => {
      const el = document.getElementById('review-result-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen paper-bg flex flex-col selection:bg-amber-200 selection:text-stone-900">
      {/* Top Header */}
      <Header
        savedCount={savedReviews.length}
        onOpenLibrary={() => setIsLibraryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
            <Feather className="w-3.5 h-3.5 text-amber-700" />
            <span>독서 & AI 문구 생성 에이전트</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif-kr tracking-tight leading-snug">
            책에서 시작된 생각이 <br className="hidden sm:inline" />
            세상에 닿는 모든 문장이 됩니다
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans-kr">
            읽은 책의 제목과 짧은 감상만 적어보세요.
            <br />
            <strong>3줄 요약 · 블로그 노션 글 · 인스타/X 숏폼 · 발제문 & 캘리그라피</strong>까지
            정갈하고 따뜻하게 빚어냅니다.
          </p>
        </section>

        {/* Input Form Section */}
        <section>
          <BookInputForm onSubmit={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">리뷰 생성 안내</div>
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Result Output Section */}
        {currentReview && (
          <section id="review-result-section" className="pt-4 scroll-mt-20">
            <ReviewDisplay
              data={currentReview}
              onSaveToLibrary={handleSaveToLibrary}
              isSaved={isSaved}
            />
          </section>
        )}

        {/* Initial Empty State / Quick Discovery */}
        {!currentReview && !isLoading && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/60 border border-stone-200/60 max-w-xl mx-auto shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800 font-serif-kr">
              아직 작성된 리뷰가 없습니다
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
              상단의 추천 도서 샘플 버튼(예: 한강 《작별하지 않는다》)을 클릭하거나, 직접 읽은 책을 입력하여 첫 문구를 생성해보세요.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/80 py-6 text-center text-xs text-stone-400 font-sans-kr mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-stone-600 font-serif-kr">북스파크 (BookSpark)</span> · 독서 & AI 문구 생성 에이전트
          </div>
          <div className="text-[11px] text-stone-400">
            Powered by Gemini 3.8 Flash & Firebase Firestore
          </div>
        </div>
      </footer>

      {/* Saved Library Drawer */}
      <SavedLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedReviews={savedReviews}
        onSelectReview={handleSelectSavedReview}
        onDeleteReview={handleDeleteSavedReview}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
