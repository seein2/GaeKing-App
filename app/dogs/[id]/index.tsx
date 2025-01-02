import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import dogService from '@/service/dog';
import DogInfoSection from '@/components/DogInfo';
import DogOrgChart from '@/components/DogOrgChart';
import { useDog } from '@/context/dogContext';

export default function DogDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { dogs, setDogs } = useDog();
    const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);

    useEffect(() => {
        loadDog();
    }, [id]);

    const loadDog = async () => {
        try {
            const response = await dogService.info(Number(id));
            if (response.success) {
                setDogProfile(response);
            }
        } catch (error) {
            console.error('강아지 정보 로딩 실패:', error);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "강아지 삭제",
            `${dogProfile?.result.dog.dog_name}를(을) 정말 삭제하시겠습니까?`,
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await dogService.delete(Number(id));
                            if (response.success) {
                                // 삭제된 강아지를 Context에서도 제거
                                const updatedDogs = dogs.filter(dog => dog.dog_id !== Number(id));
                                await setDogs(updatedDogs);

                                Alert.alert("성공", "강아지가 삭제되었습니다.");
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("오류", "강아지 삭제에 실패했습니다.");
                        }
                    }
                }
            ]
        );
    };

    if (!dogProfile) {
        return (
            <View style={styles.container}>
                <Text>강아지 정보를 불러오는 중...</Text>
            </View>
        );
    }

    const { dog, familyMembers } = dogProfile.result;

    const formatDate = (date: Date | undefined) => {
        if (!date) return '날짜 정보 없음';
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <DogInfoSection
                    breed={dog.breed_type}
                    birthDate={dog.birth_date}
                    gender={dog.gender}
                    formatDate={formatDate}
                    onEdit={() => router.push(`/dogs/${id}/update`)}
                    onDelete={handleDelete}
                />
                <DogOrgChart
                    dog={dog}
                    familyMembers={familyMembers}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});