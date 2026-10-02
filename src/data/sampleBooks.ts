import type { BookInput } from '../types/book';

export const SAMPLE_BOOKS: (BookInput & { badge: string; desc: string })[] = [
  {
    title: '작별하지 않는다',
    author: '한강 (문학동네)',
    genre: '소설 / 한국문학',
    badge: '노벨문학상 수상',
    desc: '눈송이처럼 날리는 기억과 지극한 사랑',
    quote: '눈이 내리고 있었다. 성긴 눈송이들이 어둠 속에서 천천히 떠돌며 내려앉고 있었다.',
    personalReview: '타인의 고통을 잊지 않고 기어이 사랑을 끝까지 건너가겠다는 마음이 아릿하게 전해져 밤새 울컥했습니다.',
    tone: 'poetic',
  },
  {
    title: '맡겨진 소녀',
    author: '클레어 키건 (다산책방)',
    genre: '소설 / 영미문학',
    badge: '세계적 베스트셀러',
    desc: '조용하고 투명한 다정함의 위로',
    quote: '입을 다물기 딱 좋은 기회를 놓쳐서 많은 것을 잃는 법이다.',
    personalReview: '큰 소리를 내지 않아도 사람을 치유할 수 있다는 사실을 알려준 다정하고 따뜻한 책입니다.',
    tone: 'warm',
  },
  {
    title: '세이노의 가르침',
    author: '세이노 (데이원)',
    genre: '자기계발 / 경제경영',
    badge: '스테디셀러',
    desc: '현실의 벽을 뚫고 나아가는 치열한 지혜',
    quote: '삶이 그대를 속일지라도 슬퍼하거나 노하지 말라. 속인 것은 삶이 아니라 그대 자신이다.',
    personalReview: '안일했던 하루에 찬물을 끼얹듯 정신이 번쩍 들게 만든 실전적인 인생 지침서였습니다.',
    tone: 'intellectual',
  },
  {
    title: '아주 작은 습관의 힘',
    author: '제임스 클리어 (비즈니스북스)',
    genre: '자기계발 / 습관',
    badge: '전 세계 1000만 부',
    desc: '1%의 사소한 변화가 만드는 거대한 결과',
    quote: '우리는 결코 목표의 수준까지 올라가지 못한다. 우리는 시스템의 수준까지 떨어질 뿐이다.',
    personalReview: '의지력에 기대지 않고 매일 2분만 실행하는 시스템을 만드니 독서와 운동 루틴이 자연스럽게 자리 잡았습니다.',
    tone: 'conversational',
  },
];
