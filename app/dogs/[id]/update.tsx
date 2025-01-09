import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import dogService from '@/service/dog';
import React from 'react';
import { useDog } from '@/context/dogContext';
import DogForm, { DogFormData } from '@/components/DogForm';
import * as ImagePicker from 'expo-image-picker';

export default function EditDog() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { dogs, setDogs } = useDog();
    const [initialData, setInitialData] = useState<DogFormData | null>(null);

    useEffect(() => {
        const loadDog = async () => {
            try {
                const response = await dogService.info(Number(id));
                if (response.success && response.result) {
                    // URL이 있는 경우에만 이미지 에셋으로 변환
                    const imageUrl = response.result.dog.profile_image ?
                        dogService.getProfileImageUrl(response.result.dog.profile_image) : undefined;

                    setInitialData({
                        dog_name: response.result.dog.dog_name,
                        birth_date: new Date(response.result.dog.birth_date ?? new Date()),
                        breed_type: response.result.dog.breed_type || '',
                        gender: response.result.dog.gender || '남자',
                        // URL이 있는 경우만 ImagePickerAsset 형태로 변환
                        profile_image: imageUrl ? {
                            uri: imageUrl,
                            width: 1,        // 기본값 설정
                            height: 1,       // 기본값 설정
                            assetId: imageUrl,
                            base64: null,
                            duration: null,
                            exif: null,
                            fileName: imageUrl.split('/').pop() || 'image.jpg',
                            fileSize: 0,
                            type: "image"
                        } : undefined
                    });
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

    const handleUpdate = async (formData: {
        dog_name: string;
        birth_date: Date;
        breed_type: string;
        gender: '남자' | '여자';
        profile_image?: ImagePicker.ImagePickerAsset;
    }) => {
        try {
            const updateData = {
                dog_name: formData.dog_name,
                birth_date: formData.birth_date,
                breed_type: formData.breed_type,
                gender: formData.gender,
                ...(formData.profile_image && { profile_image: formData.profile_image })
            };

            const response = await dogService.update(Number(id), updateData);

            if (response.success) {
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
                    { text: '확인', onPress: () => router.back() }
                ]);
            }
        } catch (error) {
            Alert.alert('오류', '강아지 정보 수정에 실패했습니다.');
            console.error('강아지 수정 실패:', error);
        }
    };

    if (!initialData) {
        return null;
    }

    return (
        <DogForm
            initialData={initialData}
            onSubmit={handleUpdate}
            submitButtonText="수정하기"
            imageButtonText="프로필 사진 변경"
        />
    );
}