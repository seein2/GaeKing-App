// 스케줄 타입 상수
const SCHEDULE_TYPES = {
  MEAL: '식사',
  WALK: '산책',
  SNACK: '간식',
  BATH: '목욕',
  HOSPITAL: '병원',
  OTHER: '기타',
} as const;

type ScheduleType = typeof SCHEDULE_TYPES[keyof typeof SCHEDULE_TYPES];

// 반복 타입
type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

// 기본 시간 슬롯 인터페이스
interface TimeSlot {
  hour: number;
  minute: number;
};

// 캘린더 표시용 마커 인터페이스
interface MarkedDates {
  [date: string]: {
    dots: Array<{ key: string; color: string }>;
    selected?: boolean;
    selectedColor?: string;
  };
}

// 스케줄 생성 요청 인터페이스
interface ScheduleCreate {
  dog_id: number;
  type: ScheduleType;
  date: string;
  description?: string;
  repeat?: {
    type: RepeatType;
    count?: number;  // daily일 때만 사용, 1-5 사이 값
  };
  times?: TimeSlot[];  // 시간 설정이 활성화된 경우에만 사용
  notification?: {
    enabled: boolean;
    minutes: number;  // 0, 10, 30, 60 중 하나
  };
};

// API 응답 스케줄 상세 정보
interface ScheduleDetail {
  schedule_id: number;
  dog_id: number;
  dog_name: string;
  schedule_type: keyof typeof SCHEDULE_TYPE_META;
  description: string | null;
  repeat_type: string | null;
  notification: {
    enabled: boolean;
    minutes: number | null;
  };
  instances: Array<{
    instance_id: number;
    scheduled_time: string | null;
    is_completed: boolean;
    completion_time: string | null;
  }>;
};

// API 응답 래퍼 인터페이스
interface ScheduleResponse {
  success: boolean;
  message: string;
  result: ScheduleDetail | null;
};

// 스케줄 완료 상태 업데이트 요청 인터페이스
interface ScheduleCompletionUpdate {
  schedule_id: number;
  completion_time: string;  // ISO 8601 형식
  is_completed: boolean;
};

// UI에서 사용할 스케줄 타입별 메타데이터
const SCHEDULE_TYPE_META = {
  '식사': {
    color: '#FF9F1C',  // 주황색
    title: '식사',
    icon: '🍽️'
  },
  '산책': {
    color: '#2EC4B6',  // 청록색
    title: '산책',
    icon: '🦮'
  },
  '간식': {
    color: '#E71D36',  // 빨간색
    title: '간식',
    icon: '🦴'
  },
  '목욕': {
    color: '#011627',  // 남색
    title: '목욕',
    icon: '🛁'
  },
  '병원': {
    color: '#FF3366',  // 분홍색
    title: '병원',
    icon: '🏥'
  },
  '기타': {
    color: '#666666',  // 회색
    title: '기타',
    icon: '📝'
  }
} as const;