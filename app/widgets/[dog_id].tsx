import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import widgetService from '@/service/widget';

const WIDGET_OPTIONS: WidgetOption[] = [
    {
        id: '생일',
        title: '생일',
        description: '강아지의 생일을 표시합니다',
        icon: '🎂'
    },
    {
        id: '식사',
        title: '식사',
        description: '식사 일정과 완료 현황을 표시합니다',
        icon: '🍽️'
    },
    {
        id: '산책',
        title: '산책',
        description: '산책 일정과 완료 현황을 표시합니다',
        icon: '🦮'
    },
    {
        id: '간식',
        title: '간식',
        description: '간식 급여 일정을 표시합니다',
        icon: '🦴'
    },
    {
        id: '목욕',
        title: '목욕',
        description: '목욕 일정을 표시합니다',
        icon: '🛁'
    },
    {
        id: '병원',
        title: '병원',
        description: '병원 방문 일정을 표시합니다',
        icon: '🏥'
    }
];

export default function WidgetSelector() {
    const { dog_id } = useLocalSearchParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState<Set<WidgetType>>(new Set());

    useEffect(() => {
        const fetchWidgetSettings = async () => {
            try {
                const response = await widgetService.getSettings(Number(dog_id));
                if (response.success && response.result) {
                    const activeWidgetTypes = Object.entries(response.result)
                        .filter(([_, isActive]) => isActive)
                        .map(([type]) => type as WidgetType);
                    setActiveWidgets(new Set<WidgetType>(activeWidgetTypes));
                }
            } catch (error) {
                console.error('Failed to fetch widget settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWidgetSettings();
    }, [dog_id]);

    // 위젯 토글 핸들러
    const toggleWidget = (widgetId: WidgetType) => {
        setActiveWidgets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(widgetId)) {
                newSet.delete(widgetId);
            } else {
                newSet.add(widgetId);
            }
            return newSet;
        });
    };

    // 저장 핸들러
    const handleSave = async () => {
        if (isSaving) return;

        // dog_id 유효성 검사 추가
        const dogId = Number(dog_id);
        if (isNaN(dogId)) {
            console.error('Invalid dog_id');
            return;
        }

        setIsSaving(true);
        try {
            // 모든 위젯 타입에 대해 활성화 상태 포함
            const widgetTypes = WIDGET_OPTIONS.reduce((acc, widget) => ({
                ...acc,
                [widget.id]: activeWidgets.has(widget.id)
            }), {});

            await widgetService.updateSettings(dogId, { widget_types: widgetTypes });
            router.push(`/(tabs)`);
        } catch (error) {
            console.error('Failed to save widget settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {WIDGET_OPTIONS.map(widget => (
                    <TouchableOpacity
                        key={widget.id}
                        style={styles.widgetOption}
                        onPress={() => toggleWidget(widget.id)}
                    >
                        <View style={styles.widgetInfo}>
                            <Text style={styles.widgetIcon}>{widget.icon}</Text>
                            <View style={styles.widgetText}>
                                <Text style={styles.widgetTitle}>{widget.title}</Text>
                                <Text style={styles.widgetDescription}>{widget.description}</Text>
                            </View>
                        </View>
                        <Switch
                            value={activeWidgets.has(widget.id)}
                            onValueChange={() => toggleWidget(widget.id)}
                            trackColor={{ false: '#767577', true: '#D3C692' }}
                            thumbColor={activeWidgets.has(widget.id) ? '#7A6836' : '#7A6836'}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.saveButtonText}>저장</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    widgetOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E0DCCD',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    widgetInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    widgetIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    widgetText: {
        flex: 1,
    },
    widgetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    widgetDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: '#7A6836',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});