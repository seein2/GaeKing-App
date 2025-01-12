// 위젯 타입 정의
type WidgetType = '식사' | '산책' | '간식' | '목욕' | '병원' | '기타' | '생일';

interface WidgetOption {
    id: WidgetType;
    title: string;
    description: string;
    icon: string;
};

interface WidgetResponse {
    success: boolean,
    message: string,
    result: WidgetSetting,
};

interface WidgetSetting {
    [key: string]: boolean;
};

interface WidgetTypes {
    widget_types: Record<string, boolean>;
};
