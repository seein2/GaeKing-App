import React, { useMemo, forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
    }) => void;
    onClose?: () => void;
    selectedDog: Dog;
    selectedType: string;
}

export const DetailsFormSheet = forwardRef<BottomSheet, DetailsFormSheetProps>(
    ({ onSubmit, onClose, selectedDog, selectedType }, ref) => {
        const snapPoints = useMemo(() => ['10%', '30%', '50%', '90%'], []);

        const [memo, setMemo] = useState('');
        const [repeat, setRepeat] = useState('none');
        const [notification, setNotification] = useState('none');

        const handleSubmit = () => {
            onSubmit({
                memo,
                repeat,
                notification
            });
        };

        return (
            <BottomSheet
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
            >
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>일정 상세 설정</Text>
                        {onClose && (
                            <TouchableOpacity onPress={onClose}>
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        )}
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

                        {/* 반복 설정 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>반복</Text>
                            <View style={styles.optionsContainer}>
                                {REPEAT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            repeat === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => setRepeat(option.id)}
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
                        </View>

                        {/* 알림 설정 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>알림</Text>
                            <View style={styles.optionsContainer}>
                                {NOTIFICATION_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            notification === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => setNotification(option.id)}
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
                        </View>

                        {/* 등록 버튼 */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>일정 등록</Text>
                        </TouchableOpacity>
                    </BottomSheetScrollView>
                </View>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
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
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});