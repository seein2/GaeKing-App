import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import scheduleService from '@/service/schedule';

const SCHEDULE_TYPES = {
    MEAL: '식사',
    WALK: '산책',
    SNACK: '간식',
    BATH: '목욕',
    HOSPITAL: '병원',
    OTHER: '기타',
} as const;

const SCHEDULE_TYPE_META = {
    [SCHEDULE_TYPES.MEAL]: {
        title: '식사',
        icon: '🍽️',
        color: '#FF6B6B',
        defaultDescription: '사료 급여'
    },
    [SCHEDULE_TYPES.WALK]: {
        title: '산책',
        icon: '🦮',
        color: '#4ECDC4',
        defaultDescription: '산책'
    },
    [SCHEDULE_TYPES.SNACK]: {
        title: '간식',
        icon: '🦴',
        color: '#FFD93D',
        defaultDescription: '간식 급여'
    },
    [SCHEDULE_TYPES.BATH]: {
        title: '목욕',
        icon: '🛁',
        color: '#6C5CE7',
        defaultDescription: '목욕'
    },
    [SCHEDULE_TYPES.HOSPITAL]: {
        title: '병원',
        icon: '🏥',
        color: '#A8E6CF',
        defaultDescription: '병원 방문'
    },
    [SCHEDULE_TYPES.OTHER]: {
        title: '기타',
        icon: '📝',
        color: '#95A5A6'
    }
} as const;

export default function ScheduleDetail() {
    const { id, date } = useLocalSearchParams<{ id: string, date: string }>();
    const router = useRouter();
    const [scheduleDetail, setScheduleDetail] = useState<ScheduleDetail | null>(null);

    useEffect(() => {
        loadScheduleDetail();
    }, [id]);

    const loadScheduleDetail = async () => {
        try {
            const response = await scheduleService.detail(Number(id), date);
            if (response.success && response.result) {
                setScheduleDetail(response.result);
            }
        } catch (error) {
            console.error('스케줄 정보 로딩 실패:', error);
        }
    };

    const handleToggleComplete = async (instanceId: number) => {
        try {
            const instance = scheduleDetail?.instances.find(i => i.instance_id === instanceId);
            if (!instance) return;

            const response = await scheduleService.updateCompletion({
                schedule_id: Number(id),
                instance_id: instanceId,
                is_completed: !instance.is_completed,
                completion_time: !instance.is_completed ? new Date().toISOString() : null
            });

            if (response.success) {
                loadScheduleDetail(); // 상태 갱신을 위해 다시 로드
            } else {
                Alert.alert("오류", "상태 변경에 실패했습니다.");
            }
        } catch (error) {
            Alert.alert("오류", "상태 변경 중 문제가 발생했습니다.");
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "스케줄 삭제",
            "이 스케줄을 정말 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await scheduleService.delete(Number(id));
                            if (response.success) {
                                Alert.alert("성공", "스케줄이 삭제되었습니다.");
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("오류", "스케줄 삭제에 실패했습니다.");
                        }
                    }
                }
            ]
        );
    };

    if (!scheduleDetail) {
        return (
            <View style={styles.container}>
                <Text>스케줄 정보를 불러올 수 없습니다.</Text>
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '시간 미지정';
        return timeString.slice(0, 5); // "HH:mm" 형식으로 변환
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* 기본 정보 섹션 */}
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.scheduleType}>
                                {SCHEDULE_TYPE_META[scheduleDetail.schedule_type].icon}{' '}
                                {SCHEDULE_TYPE_META[scheduleDetail.schedule_type].title}
                            </Text>
                            <Text style={styles.dogName}>{scheduleDetail.dog_name}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                        >
                            <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                    {scheduleDetail.description && (
                        <Text style={styles.description}>{scheduleDetail.description}</Text>
                    )}
                </View>

                {/* 반복 정보 섹션 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>반복 설정</Text>
                    <Text style={styles.repeatInfo}>
                        {scheduleDetail.repeat_type === 'none' ? '반복 없음' :
                            scheduleDetail.repeat_type === 'daily' ? `매일 ${scheduleDetail.repeat_count}회` :
                                scheduleDetail.repeat_type === 'weekly' ? '매주' : '매월'}
                    </Text>
                </View>

                {/* 알림 설정 섹션 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>알림 설정</Text>
                    <Text style={styles.notificationInfo}>
                        {scheduleDetail.notification.enabled
                            ? `${scheduleDetail.notification.minutes}분 전 알림`
                            : '알림 없음'}
                    </Text>
                </View>

                {/* 세부 일정 목록 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>세부 일정</Text>
                    {scheduleDetail.instances.map((instance, index) => (
                        <TouchableOpacity
                            key={instance.instance_id}
                            style={styles.instanceItem}
                            onPress={() => handleToggleComplete(instance.instance_id)}
                        >
                            <View style={styles.instanceInfo}>
                                <Text style={styles.instanceTime}>
                                    {formatTime(instance.scheduled_time)}
                                </Text>
                            </View>
                            <View style={[
                                styles.completionStatus,
                                instance.is_completed ? styles.completed : styles.incomplete
                            ]}>
                                <Text style={styles.statusText}>
                                    {instance.is_completed ? '완료' : '미완료'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    scheduleType: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dogName: {
        fontSize: 18,
        color: '#666',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#ff3b30',
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    description: {
        fontSize: 16,
        color: '#444',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    repeatInfo: {
        fontSize: 16,
        color: '#444',
    },
    notificationInfo: {
        fontSize: 16,
        color: '#444',
    },
    instanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    instanceInfo: {
        flex: 1,
    },
    instanceDate: {
        fontSize: 16,
        fontWeight: '500',
    },
    instanceTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    completionStatus: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    completed: {
        backgroundColor: '#4cd964',
    },
    incomplete: {
        backgroundColor: '#ff9500',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});