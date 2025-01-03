import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomCalendar } from '@/components/CustomCalendar';
import { ScheduleCreationFlow } from '@/components/schedule/BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showScheduleFlow, setShowScheduleFlow] = useState(true);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    '2024-12-30': {
      dots: [
        { key: 'dog1', color: '#FF9999' },
        { key: 'dog2', color: '#99FF99' },
      ],
    }
  });

  const dogSelectionRef = useRef<BottomSheet>(null);

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
    setShowScheduleFlow(true);
    dogSelectionRef.current?.expand();
  }, [selectedDate, markedDates]);

  return (
    <View style={styles.container}>
      <CustomCalendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      {showScheduleFlow && (
        <ScheduleCreationFlow
          selectedDate={selectedDate}
          onComplete={() => setShowScheduleFlow(true)}
          onClose={() => setShowScheduleFlow(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});