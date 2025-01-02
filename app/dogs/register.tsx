import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import dog from '@/service/dog';
import { useDog } from '@/context/dogContext';
import ImageViewer from '@/components/ImageViewer';
import React from 'react';
const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function RegisterDog() {
  const { setDogs } = useDog();
  const router = useRouter();
  const [dogName, setDogName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [breedType, setBreedType] = useState('');
  const [gender, setGender] = useState<'남자' | '여자'>('남자');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    } else {
      alert('사진을 선택하세요');
    }
  };

  const handleRegister = async () => {
    try {
      if (!dogName.trim()) {
        Alert.alert('알림', '강아지 이름을 입력해주세요.');
        return;
      }

      const result = await dog.register(
        dogName.trim(),
        birthDate,
        breedType.trim(),
        gender,
        selectedImage // ImagePickerAsset 전달
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
    <>
      <View style={styles.container}>
        {/* 프로필 사진 섹션을 맨 위로 이동 */}
        <View style={styles.profileSection}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={profileImage} />
          <Button title="프로필 사진 선택" onPress={pickImage} />
          {profileImage && (
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
          <Button title="등록하기" onPress={handleRegister} />
        </View>
      </View>
    </>
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