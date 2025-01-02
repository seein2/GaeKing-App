import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import dogService from '@/service/dog';
import ImageViewer from '@/components/ImageViewer';
import React from 'react';
import { useDog } from '@/context/dogContext';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function EditDog() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { dogs, setDogs } = useDog();
    const [dogName, setDogName] = useState('');
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [breedType, setBreedType] = useState('');
    const [gender, setGender] = useState<"남자" | "여자">("남자");
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);

    useEffect(() => {
        const loadDog = async () => {
            try {
                const response = await dogService.info(Number(id));
                if (response.success && response.result) {
                    const dog = response.result;
                    setDogName(dog.dog.dog_name);
                    if (dog.dog.birth_date) {
                        setBirthDate(new Date(dog.dog.birth_date));
                    }
                    setBreedType(dog.dog.breed_type || '');
                    setGender(dog.dog.gender || "남자");
                    if (dog.dog.profile_image) {
                        const imageUrl = dogService.getProfileImageUrl(dog.dog.profile_image);
                        setProfileImage(imageUrl || undefined);
                    }
                }
            } catch (error) {
                console.error('강아지 정보 로딩 실패:', error);
                Alert.alert('오류', '강아지 정보를 불러오는데 실패했습니다.');
            }
        };

        if (id) {
            loadDog();
        }
    }, [id]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setSelectedImage(result.assets[0]);
        }
    };

    const handleUpdate = async () => {
        try {
            if (!dogName.trim()) {
                Alert.alert('알림', '강아지 이름을 입력해주세요.');
                return;
            }

            const updateData = {
                dog_name: dogName.trim(),
                birth_date: birthDate,
                breed_type: breedType.trim(),
                gender,
                ...(selectedImage && { profile_image: selectedImage })
            };

            const response = await dogService.update(Number(id), updateData);

            if (response.success) {
                // 서버에서 업데이트된 강아지 정보를 받아와서 Context 업데이트
                const dogResponse = await dogService.info(Number(id));
                if (dogResponse.success && dogResponse.result) {
                    const updatedDogs = dogs.map(dog =>
                        dog.dog_id === Number(id)
                            ? dogResponse.result.dog
                            : dog
                    );
                    await setDogs(updatedDogs);
                }

                Alert.alert('성공', '강아지 정보가 수정되었습니다.', [
                    {
                        text: '확인',
                        onPress: () => router.back()
                    }
                ]);
            }
        } catch (error) {
            Alert.alert('오류', '강아지 정보 수정에 실패했습니다.');
            console.error('강아지 수정 실패:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <ImageViewer
                    imgSource={PlaceholderImage}
                    selectedImage={profileImage}
                />
                <Button title="프로필 사진 변경" onPress={pickImage} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    강아지 이름 <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    value={dogName}
                    onChangeText={setDogName}
                    style={styles.input}
                />

                <Text style={styles.label}>강아지 품종</Text>
                <TextInput
                    value={breedType}
                    onChangeText={setBreedType}
                    placeholder="ex) 말티푸"
                    style={styles.input}
                />

                <View style={styles.section}>
                    <Text style={styles.label}>생년월일</Text>
                    <DateTimePicker
                        value={birthDate}
                        mode="date"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setBirthDate(selectedDate);
                        }}
                        style={styles.datePicker}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>성별</Text>
                    <View style={styles.genderButtons}>
                        <Button
                            title="남자"
                            onPress={() => setGender("남자")}
                            color={gender === "남자" ? '#007AFF' : '#999'}
                        />
                        <Button
                            title="여자"
                            onPress={() => setGender("여자")}
                            color={gender === "여자" ? '#007AFF' : '#999'}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.submitButton}>
                <Button title="수정하기" onPress={handleUpdate} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 16,
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    genderButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    datePicker: {
        width: '100%',
    },
    submitButton: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    required: {
        color: 'red',
        fontSize: 16,
    },
});