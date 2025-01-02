import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ListRenderItem, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import dogService from '@/service/dog';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useDog } from '@/context/dogContext';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function Index() {
    const router = useRouter();
    const { dogs, setDogs } = useDog();

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

    const renderDogItem: ListRenderItem<Dog> = ({ item }) => (
        <TouchableOpacity
            style={styles.dogCard}
            onPress={() => router.push(`/dogs/${item.dog_id}`)}
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