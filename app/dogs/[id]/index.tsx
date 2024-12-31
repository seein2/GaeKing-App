import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import dogService from '@/service/dog';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function DogDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [dog, setDog] = useState<Dog | null>(null);

    useEffect(() => {
        const loadDog = async () => {
            try {
                const response = await dogService.info(Number(id));
                if (response.success && response.result) {
                    setDog(response.result);
                }
            } catch (error) {
                console.error('강아지 정보 로딩 실패:', error);
            }
        };

        if (id) {
            loadDog();
        }
    }, [id]);

    if (!dog) {
        return (
            <View style={styles.container}>
                <Text>강아지 정보를 불러오는 중...</Text>
            </View>
        );
    }

    const formatDate = (date: Date | undefined) => {
        if (!date) return '날짜 정보 없음';
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={
                        dog.profile_image
                            ? { uri: dogService.getProfileImageUrl(dog.profile_image) }
                            : PlaceholderImage
                    }
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{dog.dog_name}</Text>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>품종</Text>
                    <Text style={styles.value}>{dog.breed_type || '미등록'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>생년월일</Text>
                    <Text style={styles.value}>{formatDate(dog.birth_date)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>성별</Text>
                    <Text style={styles.value}>{dog.gender || '미등록'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    infoSection: {
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#666',
    },
    value: {
        flex: 2,
        fontSize: 16,
        color: '#333',
    },
});