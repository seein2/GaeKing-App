import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import dog from '@/service/dog';

export default function JoinDog() {
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            Alert.alert('알림', '초대 코드를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            await dog.joinByInvitation(inviteCode.trim());
            Alert.alert('성공', '강아지 프로필에 참여되었습니다.', [
                { text: '확인', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error) {
            Alert.alert('오류', '초대 코드가 유효하지 않거나 만료되었습니다.');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/dog/profile.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.title}>초대 코드 입력</Text>
                <TextInput
                    style={styles.input}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholder="초대 코드를 입력하세요"
                    placeholderTextColor="#7A683636"
                    autoCapitalize="characters"
                    maxLength={8}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.customButton,
                        isLoading && styles.disabledButton
                    ]}
                    onPress={handleJoin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.customButtonText}>
                        {isLoading ? "참여 중..." : "참여하기"}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3DFD5',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: 110,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -90,
        textAlign: 'center',
        color: '#7A6836',
    },
    input: {
        borderWidth: 1,
        borderColor: '#7A6836',
        borderRadius: 8,
        padding: 18,
        marginLeft: 40,
        marginRight: 40,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 40,
        width: '60%',
        alignSelf: 'center',
    },
    customButton: {
        backgroundColor: '#7A6836',
        paddingVertical: 17,
        borderRadius: 12,
    },
    disabledButton: {
        backgroundColor: '#A99F7D',
        opacity: 0.7,
    },
    customButtonText: {
        color: '#FFFFFF', // 흰색
        fontSize: 19,
        fontWeight: 'light',
        textAlign: 'center',
    },
});