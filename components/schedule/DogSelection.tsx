import React, { useMemo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import { useDog } from '@/context/dogContext';
import dogService from '@/service/dog';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

interface DogSelectionSheetProps {
    onSelect: (dog: Dog) => void;
    onClose: () => void;
    selectedDate: string;
}

export const DogSelectionSheet = forwardRef<BottomSheet, DogSelectionSheetProps>(
    ({ onSelect, onClose, selectedDate }, ref) => {
        const snapPoints = useMemo(() => ['10%', '17%', '50%', '90%'], []);
        const { dogs } = useDog();

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
                        <Text style={styles.title}>강아지 선택</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
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
        backgroundColor: '#EFEBDC',
        paddingVertical: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7A6836',
    },
    container: {
        flex: 1,
        backgroundColor: '#EFEBDC',
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#584C2D',
    },
    subtitle: {
        fontSize: 14,
        color: '#A18F5D',
        marginBottom: 24,
        marginLeft: 18,
    },
    scrollContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    dogItem: {
        width: '40%',
        backgroundColor: '#7A683636',
        borderRadius: 12,
        padding: 16,
        margin: 18,
        alignItems: 'center',
    },
    dogImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        backgroundColor: '#957C3836',
    },
    dogName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});