import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ListRenderItem, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import dogService from '@/service/dog';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function Index() {
    const router = useRouter();
    const [dogs, setDogs] = useState<Dog[]>([]);

    // 강아지 목록 불러오기
    const loadDogs = async () => {
        const response = await dogService.list();
        if (response.success && response.result) {
            setDogs(Array.isArray(response.result) ? response.result : [response.result]);
        }
    };

    useEffect(() => {
        loadDogs();
    }, []);

    // 강아지 삭제 처리
    const handleDeleteDog = async (dogId: number, dogName: string) => {
        Alert.alert(
            "강아지 삭제",
            `${dogName}를(을) 정말 삭제하시겠습니까?`,
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await dogService.delete(dogId);
                            if (response.success) {
                                Alert.alert("성공", "강아지가 삭제되었습니다.");
                                loadDogs(); // 목록 새로고침
                            }
                        } catch (error) {
                            Alert.alert("오류", "강아지 삭제에 실패했습니다.");
                        }
                    }
                }
            ]
        );
    };

    // 강아지 옵션 메뉴
    const showDogOptions = (dog: Dog) => {
        Alert.alert(
            dog.dog_name,
            "원하는 작업을 선택하세요",
            [
                {
                    text: "상세 정보",
                    onPress: () => router.push(`/dogs/${dog.dog_id}`)
                },
                {
                    text: "수정",
                    onPress: () => router.push(`/dogs/${dog.dog_id}/update`)
                },
                {
                    text: "삭제",
                    onPress: () => handleDeleteDog(dog.dog_id, dog.dog_name),
                    style: "destructive"
                },
                {
                    text: "취소",
                    style: "cancel"
                }
            ]
        );
    };

    const renderDogItem: ListRenderItem<Dog> = ({ item }) => (
        <TouchableOpacity
            style={styles.dogCard}
            onPress={() => showDogOptions(item)}
        >
            <Image
                source={
                    item.profile_image
                        ? { uri: dogService.getProfileImageUrl(item.profile_image) }
                        : PlaceholderImage
                }
                style={styles.dogImage}
            />
            <View style={styles.dogInfo}>
                <Text style={styles.dogName}>{item.dog_name}</Text>
                <Text style={styles.dogBreed}>{item.breed_type}</Text>
            </View>
            <AntDesign name="right" size={20} color="#666" />
        </TouchableOpacity>
    );

    if (dogs.length === 0) {
        return (
            <View style={styles.container}>
                <Image
                    source={PlaceholderImage}
                    style={styles.emptyImage}
                />
                <Text style={styles.message}>아직 등록된 강아지가 없어요</Text>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/dogs/register')}
                >
                    <AntDesign name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dogs}
                renderItem={renderDogItem}
                keyExtractor={item => item.dog_id.toString()}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/dogs/register')}
            >
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
    },
    dogCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dogImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    dogInfo: {
        flex: 1,
    },
    dogName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dogBreed: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
        opacity: 0.5,
        alignSelf: 'center',
    },
    message: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
});