import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomCalendar } from '@/components/CustomCalendar';
import { ScheduleBottomSheet } from '@/components/ScheduleBottomSheet';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    '2024-12-30': {
      dots: [
        { key: 'dog1', color: '#FF9999' },
        { key: 'dog2', color: '#99FF99' },
      ],
    }
  });

  const handleDayPress = useCallback((day: any) => {
    const updatedMarkedDates = { ...markedDates };
    if (selectedDate && updatedMarkedDates[selectedDate]) {
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        selected: false,
      };
    }

    updatedMarkedDates[day.dateString] = {
      ...updatedMarkedDates[day.dateString],
      selected: true,
      selectedColor: '#00adf5',
      dots: updatedMarkedDates[day.dateString]?.dots || [],
    };

    setMarkedDates(updatedMarkedDates);
    setSelectedDate(day.dateString);
    setBottomSheetIndex(0);
  }, [selectedDate, markedDates]);

  const handleCloseBottomSheet = useCallback(() => {
    setBottomSheetIndex(-1);
  }, []);

  return (
    <View style={styles.container}>
      <CustomCalendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      <ScheduleBottomSheet
        bottomSheetRef={bottomSheetRef}
        bottomSheetIndex={bottomSheetIndex}
        selectedDate={selectedDate}
        onBottomSheetChange={setBottomSheetIndex}
        onClose={handleCloseBottomSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});