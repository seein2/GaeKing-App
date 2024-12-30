import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

interface Schedule {
  type: 'walk' | 'snack' | 'meal';
  time: string;
  dogId: number;
}

interface MarkedDates {
  [date: string]: {
    dots: Array<{ key: string; color: string }>;
    selected?: boolean;
    selectedColor?: string;
  };
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null); // BottomSheet ref 추가
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    '2024-12-30': {
      dots: [
        { key: 'dog1', color: '#FF9999' },
        { key: 'dog2', color: '#99FF99' },
      ],
    }
  });

  const handleDayPress = useCallback((day: any) => {
    // 이전 선택된 날짜의 selected 상태를 제거
    const updatedMarkedDates = { ...markedDates };
    if (selectedDate && updatedMarkedDates[selectedDate]) {
      updatedMarkedDates[selectedDate] = {
        ...updatedMarkedDates[selectedDate],
        selected: false,
      };
    }

    // 새로 선택된 날짜에 selected 상태 추가
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

  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={[styles.calendarContainer, { height: height * 0.9 }]}>
        <Calendar
          style={styles.calendar}
          markingType={'multi-dot'}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            dotColor: '#00adf5',
            monthTextColor: '#2d4150',
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={['25%', '50%', '75%']}
        onChange={setBottomSheetIndex}
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
              onPress={handleCloseBottomSheet}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    position: 'relative',  // position을 명시적으로 설정
    zIndex: 0,
  },
  calendar: {
    width: '100%',
    height: '100%',
  },
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