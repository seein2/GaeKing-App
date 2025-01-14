import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from '@/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export interface DogFormData {
    dog_name: string;
    birth_date: Date;
    breed_type: string;
    gender: '남자' | '여자';
    profile_image?: ImagePicker.ImagePickerAsset;
};

interface DogFormProps {
    initialData?: DogFormData;
    onSubmit: (data: {
        dog_name: string;
        birth_date: Date;
        breed_type: string;
        gender: '남자' | '여자';
        profile_image?: ImagePicker.ImagePickerAsset;
    }) => Promise<void>;
    submitButtonText: string;
    imageButtonText: string;
};

export default function DogForm({
    initialData,
    onSubmit,
    submitButtonText,
    imageButtonText
}: DogFormProps) {
    const [dogName, setDogName] = useState(initialData?.dog_name ?? '');
    const [birthDate, setBirthDate] = useState(initialData?.birth_date ?? new Date());
    const [breedType, setBreedType] = useState(initialData?.breed_type ?? '');
    const [gender, setGender] = useState<'남자' | '여자'>(initialData?.gender ?? '남자');
    const [profileImage, setProfileImage] = useState<string | undefined>(initialData?.profile_image?.uri);
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | undefined>();

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

    const handleSubmit = async () => {
        try {
            if (!dogName.trim()) {
                Alert.alert('알림', '강아지 이름을 입력해주세요.');
                return;
            }

            await onSubmit({
                dog_name: dogName.trim(),
                birth_date: birthDate,
                breed_type: breedType.trim(),
                gender,
                profile_image: selectedImage,
            });
        } catch (error) {
            Alert.alert('오류', '처리 중 오류가 발생했습니다.');
            console.error('Form submission error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <ImageViewer
                    imgSource={PlaceholderImage}
                    selectedImage={profileImage}
                />
                <Button title={imageButtonText} onPress={pickImage} />
                {!initialData && profileImage && (
                    <Text style={styles.imageSelected}>사진이 선택되었습니다.</Text>
                )}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    강아지 이름 <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    value={dogName}
                    onChangeText={setDogName}
                    style={styles.input}
                    accessibilityLabel="강아지 이름 입력"
                    accessibilityHint="강아지의 이름을 입력하세요"
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
                            onPress={() => setGender('남자')}
                            color={gender === '남자' ? '#007AFF' : '#999'}
                        />
                        <Button
                            title="여자"
                            onPress={() => setGender('여자')}
                            color={gender === '여자' ? '#007AFF' : '#999'}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.submitButton}>
                <Button title={submitButtonText} onPress={handleSubmit} />
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
    imageSelected: {
        marginTop: 8,
        color: '#007AFF',
        textAlign: 'center',
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