// ScheduleBottomSheet.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetHandle } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface ScheduleBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    bottomSheetIndex: number;
    selectedDate: string;
    onBottomSheetChange: (index: number) => void;
    onClose: () => void;
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
            <BottomSheetView style={styles.bottomSheetContent}>
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

                <View style={styles.scheduleTypeContainer}>
                    <TouchableOpacity style={styles.scheduleTypeButton}>
                        <AntDesign name="clockcircleo" size={24} color="#666" />
                        <Text style={styles.buttonText}>산책</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scheduleTypeButton}>
                        <AntDesign name="heart" size={24} color="#666" />
                        <Text style={styles.buttonText}>간식</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scheduleTypeButton}>
                        <AntDesign name="rest" size={24} color="#666" />
                        <Text style={styles.buttonText}>밥</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
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
    bottomSheetContent: {
        flex: 1,
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
    scheduleTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    scheduleTypeButton: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        width: '28%',
    },
    buttonText: {
        marginTop: 8,
        fontSize: 14,
        color: '#333',
    },
});