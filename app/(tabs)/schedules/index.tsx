import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { CustomCalendar } from '@/components/CustomCalendar';
import { ScheduleCreationFlow } from '@/components/schedule/BottomSheet';
import scheduleService from '@/service/schedule';
import { router, usePathname } from 'expo-router';

const SCHEDULE_TYPE_META = {
  '식사': {
    color: '#FF9F1C',  // 주황색
    title: '식사',
    icon: '🍽️'
  },
  '산책': {
    color: '#2EC4B6',  // 청록색
    title: '산책',
    icon: '🦮'
  },
  '간식': {
    color: '#E71D36',  // 빨간색
    title: '간식',
    icon: '🦴'
  },
  '목욕': {
    color: '#011627',  // 남색
    title: '목욕',
    icon: '🛁'
  },
  '병원': {
    color: '#FF3366',  // 분홍색
    title: '병원',
    icon: '🏥'
  },
  '기타': {
    color: '#666666',  // 회색
    title: '기타',
    icon: '📝'
  }
} as const;

export default function ScheduleScreen() {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayString);
  const [showScheduleFlow, setShowScheduleFlow] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    [todayString]: {
      selected: true,
      selectedColor: '#00adf5',
      dots: []
    }
  });

  const fetchSchedules = async (date: string) => {
    try {
      setLoading(true);
      const response = await scheduleService.list(date);

      if (response.success && Array.isArray(response.result)) {
        setSchedules(response.result);

        const newMarkedDates = { ...markedDates };
        newMarkedDates[date] = {
          ...newMarkedDates[date],
          dots: response.result.map((schedule) => ({
            key: schedule.schedule_id.toString(),
            color: SCHEDULE_TYPE_META[schedule.schedule_type as keyof typeof SCHEDULE_TYPE_META].color
          }))
        };
        setMarkedDates(newMarkedDates);
      } else {
        setSchedules([]);
        const newMarkedDates = { ...markedDates };
        newMarkedDates[date] = {
          ...newMarkedDates[date],
          dots: []
        };
        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error('일정 조회 실패:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

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
  }, [selectedDate, markedDates]);

  const handleScheduleComplete = () => {
    setShowScheduleFlow(false);
    fetchSchedules(selectedDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <CustomCalendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
        />

        <View style={styles.listContainer}>
          <Text style={styles.dateHeader}>
            {new Date(selectedDate).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>

          {loading ? (
            <ActivityIndicator style={styles.loader} color="#00adf5" />
          ) : (
            <ScrollView style={styles.scrollView}>
              {schedules.map((schedule: any, index: number) => (
                <TouchableOpacity
                  key={`${schedule.schedule_id}-${schedule.scheduled_time || 'unset'}-${index}`}
                  style={styles.scheduleCard}
                  onPress={() => router.push({
                    pathname: "/schedules/[id]",
                    params: { id: schedule.schedule_id, date: selectedDate }
                  })}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.typeIndicator,
                    { backgroundColor: SCHEDULE_TYPE_META[schedule.schedule_type as keyof typeof SCHEDULE_TYPE_META].color }
                  ]} />
                  <View style={styles.scheduleInfo}>
                    <View style={styles.scheduleHeader}>
                      <Text style={styles.dogName}>{schedule.dog_name}</Text>
                      <Text style={styles.scheduleTime}>{schedule.scheduled_time}</Text>
                    </View>
                    <View style={styles.scheduleContent}>
                      <Text style={styles.scheduleType}>
                        {SCHEDULE_TYPE_META[schedule.schedule_type as keyof typeof SCHEDULE_TYPE_META].icon}{' '}
                        {SCHEDULE_TYPE_META[schedule.schedule_type as keyof typeof SCHEDULE_TYPE_META].title}
                      </Text>
                      {schedule.description && (
                        <Text style={styles.description} numberOfLines={1}>
                          {schedule.description}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {showScheduleFlow && (
          <ScheduleCreationFlow
            selectedDate={selectedDate}
            onComplete={handleScheduleComplete}
            onClose={() => setShowScheduleFlow(false)}
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
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  typeIndicator: {
    width: 4,
    backgroundColor: '#000',
  },
  scheduleInfo: {
    flex: 1,
    padding: 15,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dogName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
  },
  scheduleContent: {
    gap: 4,
  },
  scheduleType: {
    fontSize: 15,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  }
});