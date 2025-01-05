import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { CustomCalendar } from '@/components/CustomCalendar';
import { ScheduleCreationFlow } from '@/components/schedule/BottomSheet';

export default function ScheduleScreen() {
  // 오늘 날짜를 기본값으로 설정
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [showScheduleFlow, setShowScheduleFlow] = useState(true);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    [todayString]: {
      selected: true,
      selectedColor: '#00adf5',
      dots: []
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
    setShowScheduleFlow(true);  // 날짜 선택시 바텀시트 표시
  }, [selectedDate, markedDates]);

  const handleScheduleComplete = () => {
    setShowScheduleFlow(false);  // 일정 등록 완료시 바텀시트 닫기
    // TODO: 필요한 경우 달력 업데이트 로직 추가
    // 예: 새로운 일정에 대한 dot 추가
    // const updatedMarkedDates = { ...markedDates };
    // updatedMarkedDates[selectedDate].dots.push({ key: 'newSchedule', color: '#someColor' });
    // setMarkedDates(updatedMarkedDates);
  };

  const handleScheduleClose = () => {
    setShowScheduleFlow(false);  // 바텀시트 닫기
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <CustomCalendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
        />
        {showScheduleFlow && (
          <ScheduleCreationFlow
            selectedDate={selectedDate}
            onComplete={handleScheduleComplete}
            onClose={handleScheduleClose}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});