import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ListRenderItem, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import dogService from '@/service/dog';
import { useEffect, useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useDog } from '@/context/dogContext';
import { Widget } from '@/components/widget/Widget';
import widgetService from '@/service/widget';
import { RefreshableFlatList } from '@/components/refresh/Refresh';

const PlaceholderImage = require('@/assets/images/dog/profile.png');

export default function Index() {
    const router = useRouter();
    const { dogs, setDogs } = useDog();
    const [dogWidgets, setDogWidgets] = useState<DogWidgets>({});

    const loadData = async () => {
        await loadDogsAndWidgets();
    };

    // 강아지 목록과 위젯 설정 불러오기
    const loadDogsAndWidgets = async () => {
        const response = await dogService.list();
        if (response.success && response.result) {
            const dogList = Array.isArray(response.result) ? response.result : [response.result];
            setDogs(dogList);

            // 각 강아지의 위젯 정보 불러오기
            const widgetSettings: DogWidgets = {};
            for (const dog of dogList) {
                try {
                    const widgetResponse = await widgetService.getActiveWidgets(dog.dog_id);
                    if (widgetResponse.success && widgetResponse.result) {
                        widgetSettings[dog.dog_id] = widgetResponse.result;
                    }
                } catch (error) {
                    console.error(`Failed to load widgets for dog ${dog.dog_id}:`, error);
                }
            }
            setDogWidgets(widgetSettings);
        }
    };

    useEffect(() => {
        loadDogsAndWidgets();
    }, []);

    const renderDogItem: ListRenderItem<Dog> = ({ item }) => (
        <View style={styles.dogContainer}>
            {/* 강아지 프로필 헤더 */}
            <TouchableOpacity
                style={styles.profileHeader}
                onPress={() => router.push(`/dogs/${item.dog_id}`)}
            >
                <View style={styles.profileLeft}>
                    <Image
                        source={
                            item.profile_image
                                ? { uri: dogService.getProfileImageUrl(item.profile_image) }
                                : PlaceholderImage
                        }
                        style={styles.profileImage}
                    />
                    <Text style={styles.dogName}>{item.dog_name}</Text>
                </View>
                <AntDesign name="right" size={20} color="#666" />
            </TouchableOpacity>

            {/* 위젯 영역 */}
            <View style={styles.widgetArea}>
                {dogWidgets[item.dog_id]?.length > 0 ? (
                    <View style={styles.widgetGrid}>
                        {dogWidgets[item.dog_id].map((widgetData) => (
                            <Widget
                                key={widgetData.widget_type}  // key prop으로는 widget_type을 사용
                                type={widgetData.widget_type} // type prop으로도 widget_type을 전달
                                data={widgetData}  // 전체 데이터는 별도 prop으로 전달
                                onPress={() => {
                                    console.log(`${widgetData.widget_type} widget pressed for dog ${item.dog_id}`);
                                }}
                            />
                        ))}
                    </View>
                ) : null}
                <TouchableOpacity
                    style={styles.addWidgetButton}
                    onPress={() => router.push(`/widgets/${item.dog_id}`)}
                >
                    <AntDesign name="plus" size={20} color="#666" />
                    <Text style={styles.addWidgetText}>위젯 추가</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (dogs.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContent}>
                <Image
                    source={PlaceholderImage}
                    style={styles.emptyImage}
                />
                <Text style={styles.message}>아직 등록된 강아지가 없어요</Text>
                </View>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/dogs/register')}
                >
                    <AntDesign name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    };
    const SpeedDialButton = () => {
        const [isOpen, setIsOpen] = useState(false);
        const animation = useRef(new Animated.Value(0)).current;
        const router = useRouter();

        const toggleMenu = () => {
            const toValue = isOpen ? 0 : 1;
            Animated.spring(animation, {
                toValue,
                friction: 5,
                useNativeDriver: true,
            }).start();
            setIsOpen(!isOpen);
        };

        const registerOptionStyle = {
            transform: [
                { scale: animation },
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -120]
                    })
                }
            ],
            opacity: animation
        };

        const codeOptionStyle = {
            transform: [
                { scale: animation },
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -170]
                    })
                }
            ],
            opacity: animation
        };

        return (
            <View style={styles.speedDial}>
                {/* 직접 등록 옵션 */}
                <Animated.View style={[styles.speedDialOption, registerOptionStyle]}>
                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => {
                            router.push('/dogs/register');
                            toggleMenu();
                        }}
                    >
                        <View style={[styles.fabOption, { backgroundColor: '#4CAF50' }]}>
                            <AntDesign name="form" size={20} color="white" />
                        </View>
                        <Text style={styles.optionLabel}>직접 등록</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* 코드로 등록 옵션 */}
                <Animated.View style={[styles.speedDialOption, codeOptionStyle]}>
                    <TouchableOpacity
                        style={styles.optionContainer}
                        onPress={() => {
                            router.push('/dogs/register-code');
                            toggleMenu();
                        }}
                    >
                        <View style={[styles.fabOption, { backgroundColor: '#2196F3' }]}>
                            <AntDesign name="idcard" size={20} color="white" />
                        </View>
                        <Text style={styles.optionLabel}>코드로 등록</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* 메인 FAB 버튼 */}
                <TouchableOpacity
                    style={[styles.fab, isOpen && styles.fabActive]}
                    onPress={toggleMenu}
                >
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    rotate: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '45deg']
                                    })
                                }
                            ]
                        }}
                    >
                        <AntDesign name="plus" size={24} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <RefreshableFlatList
                data={dogs}
                renderItem={renderDogItem}
                keyExtractor={item => item.dog_id.toString()}
                contentContainerStyle={styles.listContainer}
                onRefresh={loadData}
            />
            <SpeedDialButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    dogCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dogImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    dogInfo: {
        flex: 1,
    },
    dogName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dogBreed: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
        opacity: 0.5,
        alignSelf: 'center',
    },
    message: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#7A6836',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    speedDial: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        alignItems: 'center',
    },
    speedDialOption: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    optionLabel: {
        color: '#666',
        marginRight: 10,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    fabOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    fabActive: {
        backgroundColor: '#ff4444',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    // 기존 styles에 추가
    dogContainer: {
        backgroundColor: '#f8f3e8',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#e6dcc6',
        borderWidth: 2,
        borderColor: '#7A6836',
    },
    widgetArea: {
        marginTop: 16,
    },
    addWidgetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    addWidgetText: {
        color: '#666',
        fontSize: 16,
    },
    widgetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: 16,
    },

});