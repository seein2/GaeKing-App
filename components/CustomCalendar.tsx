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
                    backgroundColor: '#F3EFDD',
                    calendarBackground: '#F3EFDD',
                    textSectionTitleColor: '#B3AAAA',
                    selectedDayBackgroundColor: '#7A6836',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#B3AAAA',
                    dayTextColor: 'black',
                    arrowColor: '#7A6836',
                    dotColor: '#00adf5',
                    monthTextColor: '#7A6836',
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
        flex: 1.3,
        width: 330,
        marginTop: 16,
        marginBottom: 100,
        alignSelf: 'center',
        padding: 16,
        backgroundColor: '#F3EFDD',
        position: 'relative',  // position을 명시적으로 설정
        zIndex: 0,
        borderRadius: 13,  // 둥근 모서리 추가
        overflow: 'hidden', // 이를 추가하여 내부 컨텐츠가 borderRadius를 벗어나지 않도록 함
    },
    calendar: {
        width: '100%',
        height: '100%',
    },
});