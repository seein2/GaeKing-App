import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CustomCalendarProps {
    markedDates: MarkedDates;
    onDayPress: (day: any) => void;
}

export function CustomCalendar({ markedDates, onDayPress }: CustomCalendarProps) {
    const { height } = Dimensions.get('window');

    return (
        <View style={[styles.calendarContainer, { height: height * 0.9 }]}>
            <Calendar
                style={styles.calendar}
                markingType={'multi-dot'}
                markedDates={markedDates}
                onDayPress={onDayPress}
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
    );
}

const styles = StyleSheet.create({
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
});