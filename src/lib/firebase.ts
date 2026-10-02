import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';
import type { SavedReviewRecord, GeneratedReviewData } from '../types/book';

// 사용자 지정 Firebase 설정 (환경 변수 우선, 기본값으로 사용자 제공값 적용)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArYxma556zkAH6RX2AFsKcvZjVmIf-kvk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visit-3ec6b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visit-3ec6b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visit-3ec6b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "337663305899",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:337663305899:web:d20654a8463f23c5c22fee"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase 초기화 경고 (로컬 스토리지를 대체 저장소로 사용합니다):', error);
}

const LOCAL_STORAGE_KEY = 'bookspark_saved_reviews_v1';

// 로컬 스토리지 헬퍼
function getLocalReviews(): SavedReviewRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('로컬스토리지 읽기 오류:', e);
    return [];
  }
}

function saveLocalReviews(reviews: SavedReviewRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('로컬스토리지 쓰기 오류:', e);
  }
}

/**
 * 리뷰 저장 (Firebase Firestore 저장 시도 + 로컬스토리지 항상 백업 동기화)
 */
export async function saveReviewToStorage(data: GeneratedReviewData): Promise<SavedReviewRecord> {
  const newId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const nowIso = new Date().toISOString();

  const record: SavedReviewRecord = {
    ...data,
    id: data.id || newId,
    createdAt: data.createdAt || nowIso,
  };

  // 로컬 스토리지에 먼저 즉시 저장
  const localList = getLocalReviews();
  const updatedList = [record, ...localList.filter((r) => r.id !== record.id)];
  saveLocalReviews(updatedList);

  // Firestore 연결 가능 시 비동기 저장
  if (db) {
    try {
      const colRef = collection(db, 'book_reviews');
      await addDoc(colRef, {
        ...record,
        serverTimestamp: new Date(),
      });
    } catch (firestoreError) {
      console.info('Firestore 저장 안내: 네트워크 또는 보안 규칙 설정에 따라 로컬 저장소에 안전하게 보관되었습니다.');
    }
  }

  return record;
}

/**
 * 저장된 리뷰 목록 불러오기 (Firestore 우선 조회 후, 실패 시 로컬스토리지 활용)
 */
export async function fetchSavedReviews(): Promise<SavedReviewRecord[]> {
  const localList = getLocalReviews();

  if (db) {
    try {
      const colRef = collection(db, 'book_reviews');
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const firestoreList: SavedReviewRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            ...(d as GeneratedReviewData),
            id: docSnap.id,
            createdAt: d.createdAt || new Date().toISOString(),
          };
        });

        // 로컬 데이터와 병합 (ID 중복 제거)
        const map = new Map<string, SavedReviewRecord>();
        firestoreList.forEach((item) => map.set(item.id, item));
        localList.forEach((item) => {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        });
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch (error) {
      // 규칙 미설정 등의 경우 로컬 데이터 반환
      console.info('Firestore 조회 대신 로컬 저장소 목록을 표시합니다.');
    }
  }

  return localList;
}

/**
 * 저장된 리뷰 삭제
 */
export async function deleteReviewFromStorage(id: string): Promise<void> {
  // 로컬 스토리지에서 삭제
  const localList = getLocalReviews();
  const filtered = localList.filter((item) => item.id !== id);
  saveLocalReviews(filtered);

  // Firestore에서 삭제 시도
  if (db) {
    try {
      const docRef = doc(db, 'book_reviews', id);
      await deleteDoc(docRef);
    } catch (e) {
      // 로컬에서 이미 삭제되었으므로 무시
    }
  }
}
