import React, { useMemo, forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

const REPEAT_OPTIONS = [
    { id: 'none', title: '반복 안함' },
    { id: 'daily', title: '매일' },
    { id: 'weekly', title: '매주' },
    { id: 'monthly', title: '매월' },
];

const NOTIFICATION_OPTIONS = [
    { id: 'none', title: '알림 없음' },
    { id: '10', title: '10분 전' },
    { id: '30', title: '30분 전' },
    { id: '60', title: '1시간 전' },
];

interface DetailsFormSheetProps {
    onSubmit: (details: {
        memo: string;
        repeat: string;
        notification: string;
        is_completed: boolean;
    }) => void;
    onClose: () => void;
    onBack: () => void;
    selectedDog: Dog;
    selectedType: string;
}

export const DetailsFormSheet = forwardRef<BottomSheet, DetailsFormSheetProps>(
    ({ onSubmit, onClose, onBack, selectedDog, selectedType }, ref) => {
        const snapPoints = useMemo(() => ['10%', '30%', '50%', '90%'], []);

        const [memo, setMemo] = useState('');
        const [repeat, setRepeat] = useState('none');
        const [notification, setNotification] = useState('none');
        const [isCompleted, setIsCompleted] = useState(false);

        const handleSubmit = () => {
            onSubmit({
                memo,
                repeat: isCompleted ? 'none' : repeat,
                notification: isCompleted ? 'none' : notification,
                is_completed: isCompleted
            });
        };

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                handleComponent={() => (
                    <View style={styles.header}>
                        <View style={styles.handle} />
                    </View>
                )}
            >
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={onBack}>
                            <AntDesign name="left" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.title}>일정 상세 설정</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                        {/* 메모 입력 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>메모</Text>
                            <TextInput
                                style={styles.memoInput}
                                value={memo}
                                onChangeText={setMemo}
                                placeholder="메모를 입력하세요"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        {/* 완료 상태 토글 */}
                        <View style={styles.section}>
                            <View style={styles.completionContainer}>
                                <View>
                                    <Text style={styles.sectionTitle}>완료 상태</Text>
                                    <Text style={styles.completionText}>
                                        {isCompleted ? '이미 완료된 일정입니다' : '완료 예정인 일정입니다'}
                                    </Text>
                                </View>
                                <Switch
                                    value={isCompleted}
                                    onValueChange={(value) => {
                                        setIsCompleted(value);
                                        if (value) {
                                            setNotification('none');
                                            setRepeat('none');
                                        }
                                    }}
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={isCompleted ? '#f5dd4b' : '#f4f3f4'}
                                />
                            </View>
                        </View>

                        {/* 반복 설정 */}
                        <View style={[styles.section, isCompleted && styles.disabledSection]}>
                            <Text style={styles.sectionTitle}>반복</Text>
                            <View style={styles.completionContainer}>
                                {REPEAT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            repeat === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => !isCompleted && setRepeat(option.id)}
                                        disabled={isCompleted}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            repeat === option.id && styles.selectedOptionText
                                        ]}>
                                            {option.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {isCompleted && (
                                <Text style={styles.disabledText}>
                                    완료된 일정은 반복을 설정할 수 없습니다
                                </Text>
                            )}
                        </View>

                        {/* 알림 설정 */}
                        <View style={[styles.section, isCompleted && styles.disabledSection]}>
                            <Text style={styles.sectionTitle}>알림</Text>
                            <View style={styles.optionsContainer}>
                                {NOTIFICATION_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            notification === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => !isCompleted && setNotification(option.id)}
                                        disabled={isCompleted}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            notification === option.id && styles.selectedOptionText
                                        ]}>
                                            {option.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {isCompleted && (
                                <Text style={styles.disabledText}>
                                    완료된 일정은 알림을 설정할 수 없습니다
                                </Text>
                            )}
                        </View>

                        {/* 등록 버튼 */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isCompleted ? styles.completedSubmitButton : styles.normalSubmitButton
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>
                                {isCompleted ? '완료된 일정 등록' : '일정 등록'}
                            </Text>
                        </TouchableOpacity>
                    </BottomSheetScrollView>
                </View>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        paddingVertical: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#DDD',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    memoInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
    },
    completionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    completionText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        marginRight: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: '#007AFF',
    },
    optionText: {
        color: '#666',
    },
    selectedOptionText: {
        color: 'white',
    },
    disabledSection: {
        opacity: 0.5,
    },
    disabledText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    submitButton: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    normalSubmitButton: {
        backgroundColor: '#007AFF',
    },
    completedSubmitButton: {
        backgroundColor: '#FF9500',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});