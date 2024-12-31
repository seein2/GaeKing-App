import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface ScheduleBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    bottomSheetIndex: number;
    selectedDate: string;
    onBottomSheetChange: (index: number) => void;
    onClose: () => void;
}

interface EventItem {
    id: string;
    title: string;
    description: string;
    checked: boolean;
}

// 커스텀 핸들 컴포넌트
const CustomHandle: React.FC<any> = ({ animatedIndex }) => {
    return (
        <View style={styles.handleContainer}>
            <View style={styles.handle} />
        </View>
    );
};

export function ScheduleBottomSheet({
    bottomSheetRef,
    bottomSheetIndex,
    selectedDate,
    onBottomSheetChange,
    onClose
}: ScheduleBottomSheetProps) {
    const [events, setEvents] = useState<EventItem[]>([
        { id: '1', title: '식사', description: '', checked: false },
        { id: '2', title: '산책', description: '', checked: false },
        { id: '3', title: '간식', description: '', checked: false },
        { id: '4', title: '목욕', description: '', checked: false },
        { id: '5', title: '병원', description: '', checked: false },
        { id: '6', title: '기타', description: '', checked: false },
    ]);

    const toggleEvent = (id: string) => {
        setEvents(events.map(event =>
            event.id === id ? { ...event, checked: !event.checked } : event
        ));
    };

    const updateDescription = (id: string, description: string) => {
        setEvents(events.map(event =>
            event.id === id ? { ...event, description } : event
        ));
    };

    // 스냅포인트 정의
    const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={onBottomSheetChange}
            enablePanDownToClose={false}
            handleComponent={CustomHandle}
            style={styles.bottomSheet}
            animateOnMount={true}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                    <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.bottomSheetHeader}>
                            <Text style={styles.dateTitle}>
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : ''}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.eventList}>
                            {events.map(event => (
                                <View key={event.id} style={styles.eventItem}>
                                    <TouchableOpacity
                                        style={styles.eventHeader}
                                        onPress={() => toggleEvent(event.id)}
                                    >
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <View style={[
                                            styles.checkbox,
                                            event.checked && styles.checkboxChecked
                                        ]}>
                                            {event.checked && (
                                                <AntDesign name="check" size={16} color="#fff" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.eventDescription}
                                        value={event.description}
                                        onChangeText={(text) => updateDescription(event.id, text)}
                                        placeholder={`${event.title}에 대해 설명해주세요...`}
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={2}
                                        maxLength={100}
                                    />
                                </View>
                            ))}
                        </View>
                    </BottomSheetScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        alignSelf: 'center',
    },
    scrollContainer: {
        padding: 20,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        padding: 8,
    },
    eventList: {
        flex: 1,
    },
    eventItem: {
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    eventDescription: {
        fontSize: 14,
        color: '#333',
        marginTop: 8,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
});