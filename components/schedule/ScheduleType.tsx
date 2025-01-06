import React, { useMemo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

const SCHEDULE_TYPES = [
    { id: '1', title: '식사', icon: '🍽️', color: '#FF6B6B', defaultDescription: '사료 급여' },
    { id: '2', title: '산책', icon: '🦮', color: '#4ECDC4', defaultDescription: '산책' },
    { id: '3', title: '간식', icon: '🦴', color: '#FFD93D', defaultDescription: '간식 급여' },
    { id: '4', title: '목욕', icon: '🛁', color: '#6C5CE7', defaultDescription: '목욕' },
    { id: '5', title: '병원', icon: '🏥', color: '#A8E6CF', defaultDescription: '병원 방문' },
    { id: '6', title: '기타', icon: '📝', color: '#95A5A6' },
] as const;

interface TypeSelectionSheetProps {
    onSelect: (type: ScheduleType) => void;
    onClose: () => void;
    onBack: () => void;
    selectedDog: Dog;
}

export const TypeSelectionSheet = forwardRef<BottomSheet, TypeSelectionSheetProps>(
    ({ onSelect, onClose, onBack, selectedDog }, ref) => {
        const snapPoints = useMemo(() => ['10%', '30%', '50%', '90%'], []);

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
                        <Text style={styles.title}>일정 유형 선택</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
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
                                    <Text style={styles.icon}>{type.icon}</Text>
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
        flex: 1,
        textAlign: 'center',
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
    icon: {
        fontSize: 24,
    },
    typeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});