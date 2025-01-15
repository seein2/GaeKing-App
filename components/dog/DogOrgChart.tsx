import React from 'react';
import { View, Text, Image, Animated } from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import dogService from "@/service/dog";

const PlaceholderImage = require('@/assets/images/dog/profile.png');

interface FamilyMember {
    user_id: string;
    user_name: string;
    children?: FamilyMember[];
}

interface FamilyOrgChartProps {
    dog: {
        dog_name: string;
        profile_image?: string;
    };
    familyMembers: FamilyMember[];
}

const TreeNode = ({ member, isRoot = false }: { member: any, isRoot?: boolean }) => {
    // 노드 진입 애니메이션
    const fadeAnim = new Animated.Value(0);
    
    React.useEffect(() => {
        Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 10,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View 
            style={[
                styles.nodeContainer,
                {
                    opacity: fadeAnim,
                    transform: [{
                        scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1],
                        }),
                    }],
                },
            ]}
        >
            <LinearGradient
                colors={isRoot ? ['#FFD700', '#FFA500'] : ['#ffffff', '#f8f9fa']}
                style={[styles.node, isRoot ? styles.rootNode : styles.memberNode]}
            >
                {isRoot ? (
                    <>
                        <View style={styles.imageContainer}>
                            <Image
                                source={
                                    member.profile_image
                                        ? { uri: dogService.getProfileImageUrl(member.profile_image) }
                                        : PlaceholderImage
                                }
                                style={styles.orgChartImage}
                            />
                            <View style={styles.crownContainer}>
                                <Text style={styles.crown}>👑</Text>
                            </View>
                        </View>
                        <Text style={styles.dogName}>{member.dog_name}</Text>
                    </>
                ) : (
                    <>
                        <View style={styles.memberIconContainer}>
                            <Text style={styles.memberIcon}>👤</Text>
                        </View>
                        <Text style={styles.memberName}>{member.user_name}</Text>
                    </>
                )}
            </LinearGradient>
            
            {member.children && member.children.length > 0 && (
                <>
                    <View style={styles.lineContainer}>
                        <View style={styles.verticalLine}>
                            <LinearGradient
                                colors={['#ddd', '#bbb']}
                                style={styles.gradientLine}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>
                    </View>
                    <View style={styles.childrenContainer}>
                        {member.children.map((child: FamilyMember, index: number) => (
                            <View key={child.user_id} style={styles.childNode}>
                                {index > 0 && (
                                    <View style={styles.horizontalLineContainer}>
                                        <LinearGradient
                                            colors={['#ddd', '#bbb']}
                                            style={styles.horizontalLine}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        />
                                    </View>
                                )}
                                <TreeNode member={child} />
                            </View>
                        ))}
                    </View>
                </>
            )}
        </Animated.View>
    );
};

export default function DogOrgChart({ dog, familyMembers }: FamilyOrgChartProps) {
    const treeData = {
        ...dog,
        children: familyMembers
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{dog.dog_name}제국 조직도</Text>
            <View style={styles.treeContainer}>
                <TreeNode member={treeData} isRoot={true} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    treeContainer: {
        alignItems: 'center',
        padding: 20,
    },
    nodeContainer: {
        alignItems: 'center',
    },
    node: {
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    rootNode: {
        minWidth: 120,
        paddingVertical: 20,
    },
    memberNode: {
        minWidth: 100,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 12,
        alignItems: 'center',
    },
    orgChartImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#fff',
    },
    crownContainer: {
        position: 'absolute',
        top: -30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    crown: {
        fontSize: 35,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    memberIconContainer: {
        marginBottom: 8,
    },
    memberIcon: {
        fontSize: 24,
    },
    dogName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    memberName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    lineContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    verticalLine: {
        width: 2,
        height: 30,
        overflow: 'hidden',
    },
    gradientLine: {
        flex: 1,
        width: '100%',
    },
    childrenContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    childNode: {
        marginHorizontal: 15,
        position: 'relative',
    },
    horizontalLineContainer: {
        position: 'absolute',
        top: -30,
        left: -15,
        right: -15,
        height: 2,
        overflow: 'hidden',
    },
    horizontalLine: {
        flex: 1,
        height: '100%',
    },
});