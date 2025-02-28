import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import auth from '@/service/auth';
import { useUser } from '@/context/userContext';

interface MenuItem {
    icon: JSX.Element;
    title: string;
    subtitle?: string;
    hasArrow?: boolean;
    onPress?: () => void;
}

export default function ProfileScreen() {
    const { user } = useUser();

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

    const menuItems: MenuItem[] = [
        {
            icon: <Ionicons name="person-circle-outline" size={24} color="#7A6836" />,
            title: '프로필 관리',
            subtitle: '프로필 사진, 이름 및 개인정보 수정',
            hasArrow: true,
        },
        {
            icon: <Ionicons name="lock-closed-outline" size={24} color="#7A6836" />,
            title: '보안 및 로그인',
            subtitle: '비밀번호 변경, 2단계 인증',
            hasArrow: true,
        },
        {
            icon: <Ionicons name="notifications-outline" size={24} color="#7A6836" />,
            title: '알림 설정',
            hasArrow: true,
        },
        {
            icon: <MaterialIcons name="privacy-tip" size={24} color="#7A6836" />,
            title: '개인정보 및 보안',
            hasArrow: true,
        },
        {
            icon: <Ionicons name="help-circle-outline" size={24} color="#7A6836" />,
            title: '고객센터',
            hasArrow: true,
        },
        {
            icon: <Ionicons name="log-out-outline" size={24} color="#D18845" />,
            title: '로그아웃',
            onPress: handleLogout,
        },
    ];

    const MenuItem = ({ icon, title, subtitle, hasArrow, onPress }: MenuItem) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress || (() => console.log(title))}
        >
            <View style={styles.menuItemLeft}>
                {icon}
                <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {hasArrow && (
                <Ionicons name="chevron-forward" size={24} color="#7A6836" />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                />
                <View style={styles.headerText}>
                    <Text style={styles.name}>{user?.user_name}</Text>
                    <Text style={styles.email}>{user?.user_id}</Text>
                </View>
            </View>

            <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                ))}
            </View>

            <Text style={styles.version}>버전 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3DFD5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 40,
        margin: 25,
        marginLeft: 15,
        marginRight: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#7A6836',
    },
    headerText: {
        marginLeft: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7A6836',
    },
    email: {
        fontSize: 14,
        color: '#7A6836',
        marginTop: 4,
    },
    menuSection: {
        backgroundColor: '#E3DFD5',
        marginTop: 0,
        borderBottomWidth: 0,
        borderColor: '#EEEEEE',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#7A683636',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {

        
        marginLeft: 15,
    },
    menuItemTitle: {
        fontSize: 16,
        color: '#7A6836',
    },
    menuItemSubtitle: {
        fontSize: 12,
        color: '#7A6836',
        marginTop: 2,
    },
    version: {
        textAlign: 'center',
        color: '#7A6836',
        fontSize: 12,
        marginTop: 20,
        marginBottom: 20,
    },
});