import { View, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import dogService from "@/service/dog";

const PlaceholderImage = require('@/assets/images/dog/profile.png');

interface FamilyMember {
    user_id: string;
    user_name: string;
}

interface FamilyOrgChartProps {
    dog: {
        dog_name: string;
        profile_image?: string;
    };
    familyMembers: FamilyMember[];
}

export default function DogOrgChart({ dog, familyMembers }: FamilyOrgChartProps) {
    const radius = 100; // 원의 반지름
    const memberCount = familyMembers.length;
    const getPosition = (index: number) => {
        // 시작 각도를 -90도(12시 방향)로 설정하고, 거기서부터 시계방향으로 배치
        const angle = (-90 + (360 / memberCount) * index) * (Math.PI / 180);
        return {
            left: radius * Math.cos(angle),
            top: radius * Math.sin(angle),
        };
    };

    return (
        <View style={styles.orgChartSection}>
            <Text style={styles.sectionTitle}>{dog.dog_name}제국 조직도</Text>
            <View style={styles.orgChart}>
                <View style={styles.orgChartDog}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={
                                dog.profile_image
                                    ? { uri: dogService.getProfileImageUrl(dog.profile_image) }
                                    : PlaceholderImage
                            }
                            style={styles.orgChartImage}
                        />
                        <Text style={styles.crown}>👑</Text>
                    </View>
                    <Text style={styles.orgChartName}>{dog.dog_name}</Text>
                </View>
                <View style={styles.familyCircle}>
                    {familyMembers.map((member, index) => {
                        const position = getPosition(index);
                        return (
                            <View
                                key={member.user_id}
                                style={[
                                    styles.memberCard,
                                    {
                                        position: 'absolute',
                                        transform: [
                                            { translateX: position.left },
                                            { translateY: position.top },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.memberName}>{member.user_name}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orgChartSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    orgChart: {
        alignItems: 'center',
    },
    orgChartDog: {
        alignItems: 'center',
    },
    orgChartImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    imageContainer: {
        position: 'relative',  // 상대 위치 설정
        marginBottom: 8,
        alignItems: 'center',
    },
    crown: {
        position: 'absolute',  // 절대 위치 설정
        top: -25,  // 이미지 위로 올리기
        fontSize: 30,  // 왕관 크기
        zIndex: 1,  // 이미지 위에 표시
    },
    orgChartName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    orgChartLine: {
        width: 2,
        height: 40,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    orgChartMembers: {
        alignItems: 'center',
    },
    orgChartMemberName: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    familyCircle: {
        position: 'relative',
        width: 250,  // 원형 레이아웃의 전체 너비
        height: 250, // 원형 레이아웃의 전체 높이
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    memberCard: {
        flexDirection: 'column', // 세로로 배치 변경
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 8,
        width: 60,  // 카드 크기 조정
        height: 60,
    },
    memberName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
});