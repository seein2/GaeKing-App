import React, { useMemo, forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Platform, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const REPEAT_OPTIONS: Array<{ id: RepeatType; title: string }> = [
    { id: 'none', title: '반복 안함' },
    { id: 'daily', title: '매일' },
    { id: 'weekly', title: '매주' },
    { id: 'monthly', title: '매월' },
];

const NOTIFICATION_OPTIONS = [
    { id: 'none', title: '알림 없음' },
    { id: '10', title: '10분 전' },
    { id: '30', title: '30분 전' },
    { id: '60', title: '1시간 전' },
];

interface TimeSlot {
    hour: number;
    minute: number;
}

interface DetailsFormSheetProps {
    onSubmit: (details: {
        description: string;
        repeat: {
            type: RepeatType;
            count?: number;
        };
        times: TimeSlot[];
        notification: {
            enabled: boolean;
            minutes: number;
        };
    }) => void;
    onClose: () => void;
    onBack: () => void;
    selectedDog: Dog;
    selectedType: ScheduleType;
}

export const DetailsFormSheet = forwardRef<BottomSheet, DetailsFormSheetProps>(
    ({ onSubmit, onClose, onBack, selectedDog, selectedType }, ref) => {
        const snapPoints = useMemo(() => ['90%'], []);

        const [description, setdescription] = useState('');
        const [repeat, setRepeat] = useState<RepeatType>('none');
        const [repeatCount, setRepeatCount] = useState(1);
        const [enableTimeSelection, setEnableTimeSelection] = useState(false);
        const [times, setTimes] = useState<TimeSlot[]>([]);
        const [notification, setNotification] = useState('none');
        const [showTimePicker, setShowTimePicker] = useState(false);
        const [currentEditingTimeIndex, setCurrentEditingTimeIndex] = useState<number | null>(null);
        const [tempSelectedTime, setTempSelectedTime] = useState<Date | null>(null);

        // 반복 횟수에 따른 최대 시간 설정 개수 계산
        const getMaxTimeSlots = () => {
            if (!enableTimeSelection) return 0;
            if (repeat === 'daily') return repeatCount;
            return 1;
        };

        const handleAddTime = () => {
            const maxSlots = getMaxTimeSlots();
            if (times.length < maxSlots) {
                setCurrentEditingTimeIndex(times.length);
                setShowTimePicker(true);
            }
        };

        // 시간 확인 처리
        const handleTimeConfirm = (date: Date) => {
            setShowTimePicker(false);

            if (currentEditingTimeIndex !== null) {
                const newTime = {
                    hour: date.getHours(),
                    minute: date.getMinutes()
                };

                const newTimes = [...times];
                newTimes[currentEditingTimeIndex] = newTime;
                setTimes(newTimes);

                // 아직 설정해야 할 시간이 남아있다면 자동으로 다음 시간 선택
                const maxSlots = getMaxTimeSlots();
                if (newTimes.length < maxSlots) {
                    setTimeout(() => {
                        setCurrentEditingTimeIndex(newTimes.length);
                        setShowTimePicker(true);
                    }, 500);
                }
            }
        };

        // 하루 반복 횟수 변경 처리
        const handleRepeatCountChange = (newCount: number) => {
            if (newCount < 1 || newCount > 5) return;
            setRepeatCount(newCount);

            // 기존 시간 배열 조정
            if (enableTimeSelection) {
                if (newCount < times.length) {
                    // 횟수가 줄어들면 마지막 시간들 삭제
                    setTimes(times.slice(0, newCount));
                } else if (newCount > times.length) {
                    // 횟수가 늘어나면 자동으로 시간 선택 모달 표시
                    setCurrentEditingTimeIndex(times.length);
                    setShowTimePicker(true);
                }
            }
        };

        const handleDeleteTime = (index: number) => {
            setTimes(times.filter((_, i) => i !== index));
        };

        // 시간 설정 토글 처리
        const handleEnableTimeSelection = (value: boolean) => {
            setEnableTimeSelection(value);
            if (!value) {
                setTimes([]);
                setNotification('none');
            } else {
                // 시간 설정이 켜지면 자동으로 첫 번째 시간 선택
                setCurrentEditingTimeIndex(0);
                setShowTimePicker(true);
            }
        };
        // 제출 처리
        const handleSubmit = () => {
            const maxSlots = getMaxTimeSlots();
            if (enableTimeSelection && times.length !== maxSlots) {
                Alert.alert(
                    "시간 설정 필요",
                    `모든 시간을 설정해주세요. (${times.length}/${maxSlots}회 설정됨)`,
                    [{ text: "확인" }]
                );
                return;
            }

            onSubmit({
                description,
                repeat: {
                    type: repeat,
                    ...(repeat === 'daily' && { count: repeatCount }),
                },
                times: enableTimeSelection ? times : [],  // 시간 설정이 꺼져있으면 빈 배열
                notification: {
                    enabled: notification !== 'none' && enableTimeSelection,
                    minutes: parseInt(notification, 10) || 0,
                },
            });
        };

        return (
            <BottomSheet
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            handleComponent={() => (
                <View style={styles.header1}>
                    <View style={styles.handle} />
                </View>
            )}
        >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                            <AntDesign name="left" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.title}>일정 상세 설정</Text>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                        {/* 메모 섹션 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>메모</Text>
                            <TextInput
                                style={styles.descriptionInput}
                                value={description}
                                onChangeText={setdescription}
                                placeholder="메모를 입력하세요"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* 반복 섹션 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>반복</Text>
                            <View style={styles.optionsContainer}>
                                {REPEAT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            repeat === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => setRepeat(option.id)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            repeat === option.id && styles.selectedOptionText
                                        ]}>
                                            {option.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {repeat === 'daily' && (
                                <View style={styles.subSection}>
                                    <Text style={styles.subSectionTitle}>하루 반복 횟수</Text>
                                    <View style={styles.countContainer}>
                                        <TouchableOpacity
                                            style={styles.countButton}
                                            onPress={() => handleRepeatCountChange(repeatCount - 1)}
                                        >
                                            <Text style={styles.countButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.countText}>{repeatCount}회</Text>
                                        <TouchableOpacity
                                            style={styles.countButton}
                                            onPress={() => handleRepeatCountChange(repeatCount + 1)}
                                        >
                                            <Text style={styles.countButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* 시간 설정 섹션 */}
                        <View style={styles.section}>
                            <View style={styles.timeToggleContainer}>
                                <Text style={styles.sectionTitle}>시간 설정</Text>
                                <Switch
                                    value={enableTimeSelection}
                                    onValueChange={handleEnableTimeSelection}
                                    ios_backgroundColor="#7A683636"
                                    trackColor={{ false: '#7A683636', true: '#7A6836' }}
                                    thumbColor={enableTimeSelection ? '#7A683636' : '#7A6836'}
                                />
                            </View>

                            {enableTimeSelection && (
                                <View style={styles.timeContainer}>
                                    {times.map((time, index) => (
                                        <View key={index} style={styles.timeItemContainer}>
                                            <TouchableOpacity
                                                style={styles.timeItem}
                                                onPress={() => {
                                                    setCurrentEditingTimeIndex(index);
                                                    setShowTimePicker(true);
                                                }}
                                            >
                                                <Text style={styles.timeText}>
                                                    {`${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteTime(index)}
                                            >
                                                <AntDesign name="close" size={16} color="#666" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    {times.length < getMaxTimeSlots() && (
                                        <TouchableOpacity
                                            style={styles.addTimeButton}
                                            onPress={handleAddTime}
                                        >
                                            <AntDesign name="plus" size={24} color="#007AFF" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* 알림 설정 섹션 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>알림</Text>
                            <View style={styles.optionsContainer}>
                                {NOTIFICATION_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            notification === option.id && styles.selectedOption,
                                            !enableTimeSelection && styles.disabledOption
                                        ]}
                                        onPress={() => enableTimeSelection && setNotification(option.id)}
                                        disabled={!enableTimeSelection}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            notification === option.id && styles.selectedOptionText,
                                            !enableTimeSelection && styles.disabledOptionText
                                        ]}>
                                            {option.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 등록 버튼 */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>등록</Text>
                        </TouchableOpacity>
                    </BottomSheetScrollView>

                    {/* 시간 선택기 */}
                    {showTimePicker && Platform.OS === 'ios' && (
                        <View style={styles.timePickerContainer}>
                            <View style={styles.timePickerHeader}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowTimePicker(false);
                                        setTempSelectedTime(null);
                                    }}
                                    style={styles.timePickerButton}
                                >
                                    <Text style={[styles.timePickerButtonText, { color: '#666' }]}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (tempSelectedTime) {
                                            handleTimeConfirm(tempSelectedTime);
                                        } else {
                                            handleTimeConfirm(new Date());
                                        }
                                        setTempSelectedTime(null);
                                    }}
                                    style={styles.timePickerButton}
                                >
                                    <Text style={[styles.timePickerButtonText, { color: '#007AFF' }]}>완료</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timePickerWrapper}>
                                <DateTimePicker
                                    value={tempSelectedTime || new Date()}
                                    mode="time"
                                    is24Hour={false}
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setTempSelectedTime(selectedDate);
                                        }
                                    }}
                                    style={styles.timePicker}
                                    textColor="#000000"
                                />
                            </View>
                        </View>
                    )}
                    {showTimePicker && Platform.OS === 'android' && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowTimePicker(false);
                                if (selectedDate && event.type === 'set') {
                                    handleTimeConfirm(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEBDC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#EFEBDC',
    },
    header1: {
        backgroundColor: '#EFEBDC',
        paddingVertical: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7A6836',
    },
    headerButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#584C2D',
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#705817',
        marginBottom: 12,
    },
    subSection: {
        marginTop: 16,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    subSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    descriptionInput: {
        backgroundColor: '#7A683636',
        borderRadius: 12,
        padding: 12,
        height: 100,
        fontSize: 14,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#7A683636',
    },
    selectedOption: {
        backgroundColor: '#7A68368A',
    },
    disabledOption: {
        backgroundColor: '#e9ecef',
        opacity: 0.5,
    },
    optionText: {
        fontSize: 14,
        color: '#7A68369C',
    },
    selectedOptionText: {
        color: 'white',
    },
    disabledOptionText: {
        color: '#adb5bd',
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    countButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countButtonText: {
        fontSize: 20,
        color: '#495057',
    },
    countText: {
        fontSize: 16,
        marginHorizontal: 16,
        color: '#495057',
    },
    timeToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        color: '#7A6836',
    },
    timeItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeItem: {
        backgroundColor: '#7A683636',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    timeText: {
        fontSize: 14,
        color: '#495057',
    },
    deleteButton: {
        marginLeft: 4,
        padding: 4,
    },
    addTimeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#7A6836',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    timePickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    timePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    timePickerButton: {
        padding: 8,
    },
    timePickerButtonText: {
        fontSize: 16,
        color: '#666',
    },
    timePickerWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timePicker: {
        height: 200,
        width: '100%',
    },
});