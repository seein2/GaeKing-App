import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { router, Link } from 'expo-router';
import AuthInput from '@/components/AuthInput';
import auth from '@/service/auth';
import { useUser } from '@/context/userContext';

export default function Login() {
    const { setUser } = useUser();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        try {
            if (!id) {
                setError('아이디를 입력하세요.');
                return;
            }
            if (!password) {
                setError('비밀번호를 입력하세요.');
                return;
            }

            setIsLoading(true);
            const response = await auth.login(id, password);
            if (response.success && response.user) {
                setUser(response.user);
                router.replace('/');
            } else {
                console.error(response.message);

                setError(response.message);
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setIsLoading(false);
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
                    accessibilityLabel="아이디 입력"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <AuthInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="비밀번호"
                    accessibilityLabel="비밀번호 입력"
                    secureTextEntry
                    autoCapitalize="none"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>로그인</Text>
                    )}
                </TouchableOpacity>
                <Link href="/join" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>회원가입 하기</Text>
                    </TouchableOpacity>
                </Link>
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
        alignSelf: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
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