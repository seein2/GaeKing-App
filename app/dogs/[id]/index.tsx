import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import dogService from '@/service/dog';
import DogInfoSection from '@/components/dog/DogInfo';
import DogOrgChart from '@/components/dog/DogOrgChart';
import { useDog } from '@/context/dogContext';
import * as Clipboard from 'expo-clipboard';

export default function DogDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { dogs, setDogs } = useDog();
    const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
    const [invitationCode, setInvitationCode] = useState<string | null>(null);

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

    // 화면이 포커스될 때마다 데이터 새로고침
    useFocusEffect(
        useCallback(() => {
            loadDog();
        }, [id])
    );

    const handleInvite = async () => {
        try {
            const response = await dogService.createInvitation(Number(id));
            if (response.success) {
                setInvitationCode(response.result.code);
            }
        } catch (error) {
            Alert.alert("오류", "초대 코드 생성에 실패했습니다.");
        }
    };

    const copyToClipboard = async () => {
        try {
            await Clipboard.setStringAsync(invitationCode!);
            Alert.alert("복사 완료", "초대 코드가 클립보드에 복사되었습니다.");
        } catch (error) {
            Alert.alert("오류", "복사에 실패했습니다.");
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

    if (!dogProfile?.result) {
        return (
            <View style={styles.container}>
                <Text>강아지 정보를 불러올 수 없습니다.</Text>
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
                {invitationCode ? (
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>초대 코드 (3분 동안 유효)</Text>
                        <Text style={styles.codeText}>{invitationCode}</Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={copyToClipboard}
                        >
                            <Text style={styles.copyButtonText}>복사하기</Text>
                        </TouchableOpacity>
                        <Text style={styles.codeInstruction}>이 코드를 가족 구성원에게 공유하세요</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={handleInvite}
                    >
                        <Text style={styles.inviteButtonText}>가족 구성원 초대하기</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inviteButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    codeContainer: {
        margin: 16,
        padding: 20,
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    codeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 2,
        marginVertical: 8,
    },
    codeInstruction: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    copyButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginTop: 12,
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});