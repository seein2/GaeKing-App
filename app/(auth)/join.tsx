import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { router } from 'expo-router';
import AuthInput from '@/components/AuthInput';
import auth from '@/service/auth';

export default function Join() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async () => {
    try {
      // 입력값 검증
      if (!id) {
        setError('아이디를 입력하세요.');
        return;
      }
      if (!password) {
        setError('비밀번호를 입력하세요.');
        return;
      }
      if (!userName) {
        setError('닉네임을 입력하세요.');
        return;
      }
      const response = await auth.join(id, password, userName);
      if (response.success) {
        // 회원가입 성공
        router.replace('/login'); // 로그인 페이지로 이동
      } else {
        console.error(response.message);
        setError(response.message);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/dog/profile.png')}
          style={styles.titleImage}
        />
        <Image
          source={require('@/assets/images/dog/logo.png')}
          style={[styles.titleImage, {
            position: 'absolute',
            left: 40,
            top: 60,
          }]}
        />
        <AuthInput
          value={id}
          onChangeText={setId}
          placeholder="아이디"
        />
        <AuthInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
        />
        <AuthInput
          value={userName}
          onChangeText={setUserName}
          placeholder="사용자 이름"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleJoin}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>로그인으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titleImage: {
    width: 102,
    height: 88,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  button: {
    backgroundColor: '#D3C692',
    width: 283,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  linkText: {
    color: '#BAB6B6',
    marginTop: 15,
  },
});