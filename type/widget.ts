// 위젯 타입 정의
type WidgetType = '식사' | '산책' | '간식' | '목욕' | '병원' | '생일';

// 위젯데이터(메인화면용
interface WidgetData {
    widget_type: WidgetType;
    today_count: number;
    completed_count: number;
    birth_date?: string;
}
interface ActiveWidgetsResponse {
    success: boolean;
    message: string;
    result: WidgetData[];
}

// 위젯 옵션
interface WidgetOption {
    id: WidgetType;
    title: string;
    description: string;
    icon: string;
};

// 위젯 세팅화면
interface WidgetSetting {
    [key: string]: boolean;
};
interface WidgetResponse {
    success: boolean,
    message: string,
    result: WidgetSetting,
};

// 위젯 활성화여부 전송(토글)
interface WidgetTypes {
    widget_types: Record<string, boolean>;
};

type WidgetProps = {
    type: WidgetType;
    data?: WidgetData;
    onPress: () => void;
};

// 강아지위젯
interface DogWidgets {
    [dog_id: number]: WidgetData[];
}
