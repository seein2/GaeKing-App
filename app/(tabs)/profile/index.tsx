import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import auth from "@/service/auth";

export default function Profile() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "네",
                    onPress: async () => {
                        try {
                            await auth.logout();
                            router.replace('/(auth)/login');
                        } catch (error) {
                            console.log(error);
                            Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>프로필 화면</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.button}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});