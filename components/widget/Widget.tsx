import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const WIDGET_ICONS = {
    '생일': '🎂',
    '식사': '🍽️',
    '산책': '🦮',
    '간식': '🦴',
    '목욕': '🛁',
    '병원': '🏥'
} as const;  // as const를 추가하여 타입을 더 정확하게 만듦

export const Widget = ({ type, onPress }: WidgetProps) => (
    <TouchableOpacity
        style={styles.widget}
        onPress={onPress}
    >
        <Text style={styles.widgetIcon}>{WIDGET_ICONS[type]}</Text>
        <Text style={styles.widgetTitle}>{type}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    widget: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    widgetIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    widgetTitle: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
});

export { WIDGET_ICONS };