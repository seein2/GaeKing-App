import { Alert, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import dog from '@/service/dog';
import { useDog } from '@/context/dogContext';
import React from 'react';
import DogForm, { DogFormData } from '@/components/DogForm';



export default function RegisterDog() {
  const { setDogs } = useDog();
  const router = useRouter();

  const handleRegister = async (formData: DogFormData) => {
    try {
      const result = await dog.register(
        formData.dog_name,
        formData.birth_date,
        formData.breed_type,
        formData.gender,
        formData.profile_image
      );

      await setDogs(result.result ?? []);

      Alert.alert('성공', '강아지가 등록되었습니다.', [
        { text: '확인', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('오류', '강아지 등록에 실패했습니다.');
      console.error('강아지 등록 실패:', error);
    }
  };

  return (
    <DogForm
      onSubmit={handleRegister}
      submitButtonText="등록하기"
      imageButtonText="프로필 사진 선택"
    />
  );
};