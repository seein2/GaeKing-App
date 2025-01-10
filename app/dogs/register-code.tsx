import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>초대 코드 입력</Text>
                <TextInput
                    style={styles.input}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholder="초대 코드를 입력하세요"
                    autoCapitalize="characters"
                    maxLength={8}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={isLoading ? "참여 중..." : "참여하기"}
                    onPress={handleJoin}
                    disabled={isLoading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 40,
    },
});