import React, { useMemo, forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import { useDog } from '@/context/dogContext';
import dogService from '@/service/dog';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

interface DogSelectionSheetProps {
    onSelect: (dog: Dog) => void;
    onClose?: () => void;
    selectedDate: string;
}

export const DogSelectionSheet = forwardRef<BottomSheet, DogSelectionSheetProps>(
    ({ onSelect, onClose, selectedDate }, ref) => {
        const snapPoints = useMemo(() => ['10%', '30%', '50%', '90%'], []);

        // 여기서 등록된 강아지 목록을 가져옵니다
        const { dogs } = useDog();  // Context에서 dogs 배열을 가져와야 함

        // onclose 구현
        // onclose 구현
        // onclose 구현
        // onclose 구현
        // onclose 구현

        return (
            <BottomSheet
                ref={ref}
                index={4}
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
                        <Text style={styles.title}>강아지 선택</Text>
                        {onClose && (
                            <TouchableOpacity onPress={onClose}>
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.subtitle}>
                        {new Date(selectedDate).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                        })}의 일정을 등록할 강아지를 선택하세요
                    </Text>
                    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                        {dogs?.map((dog) => (
                            <TouchableOpacity
                                key={dog.dog_id}
                                style={styles.dogItem}
                                onPress={() => onSelect(dog)}
                            >
                                <Image
                                    source={
                                        dog.profile_image
                                            ? { uri: dogService.getProfileImageUrl(dog.profile_image) }
                                            : PlaceholderImage
                                    }
                                    style={styles.dogImage}
                                />
                                <Text style={styles.dogName}>{dog.dog_name}</Text>
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
        paddingBottom: 24,
    },
    dogItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    dogImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    dogName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});