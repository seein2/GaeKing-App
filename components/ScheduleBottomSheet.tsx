import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface ScheduleBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    bottomSheetIndex: number;
    selectedDate: string;
    onBottomSheetChange: (index: number) => void;
    onClose: () => void;
}

export function ScheduleBottomSheet({
    bottomSheetRef,
    bottomSheetIndex,
    selectedDate,
    onBottomSheetChange,
    onClose
}: ScheduleBottomSheetProps) {
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={bottomSheetIndex}
            snapPoints={['10%', '50%', '75%']}
            onChange={onBottomSheetChange}
            enablePanDownToClose={true}
            style={styles.bottomSheet}
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
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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