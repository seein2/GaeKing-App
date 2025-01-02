import React, { useMemo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface ScheduleType {
    id: string;
    title: string;
    icon: keyof typeof AntDesign.glyphMap;
    color: string;
}

const SCHEDULE_TYPES: ScheduleType[] = [
    { id: '1', title: '식사', icon: 'calendar', color: '#FF6B6B' },
    { id: '2', title: '산책', icon: 'pushpin', color: '#4ECDC4' },
    { id: '3', title: '간식', icon: 'heart', color: '#FFD93D' },
    { id: '4', title: '목욕', icon: 'star', color: '#6C5CE7' },
    { id: '5', title: '병원', icon: 'medicinebox', color: '#A8E6CF' },
    { id: '6', title: '기타', icon: 'ellipsis1', color: '#95A5A6' },
];

interface TypeSelectionSheetProps {
    onSelect: (typeId: string) => void;
    onClose?: () => void;
    selectedDog: Dog;  // 이전 단계에서 선택한 강아지 정보
}

export const TypeSelectionSheet = forwardRef<BottomSheet, TypeSelectionSheetProps>(
    ({ onSelect, onClose, selectedDog }, ref) => {
        const snapPoints = useMemo(() => ['10%', '30%', '50%', '90%'], []);

        return (
            <BottomSheet
                ref={ref}
                index={0}
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
                        <Text style={styles.title}>일정 유형 선택</Text>
                        {onClose && (
                            <TouchableOpacity onPress={onClose}>
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.subtitle}>
                        {selectedDog.dog_name}의 일정 유형을 선택해주세요
                    </Text>

                    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                        {SCHEDULE_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={styles.typeItem}
                                onPress={() => onSelect(type.id)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                                    <AntDesign name={type.icon} size={24} color="white" />
                                </View>
                                <Text style={styles.typeTitle}>{type.title}</Text>
                            </TouchableOpacity>
                        ))}
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
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    scrollContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    typeItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    typeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});