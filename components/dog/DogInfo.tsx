// components/dogs/DogInfoSection.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface DogInfoSectionProps {
    breed?: string;
    birthDate: Date | undefined;
    gender?: string;
    formatDate: (date: Date | undefined) => string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DogInfoSection({
    breed,
    birthDate,
    gender,
    formatDate,
    onEdit,
    onDelete
}: DogInfoSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>품종</Text>
                    <Text style={styles.value}>{breed || '미등록'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>생년월일</Text>
                    <Text style={styles.value}>{formatDate(birthDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>성별</Text>
                    <Text style={styles.value}>{gender || '미등록'}</Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={onEdit}
                >
                    <AntDesign name="edit" size={20} color="white" />
                    <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={onDelete}
                >
                    <AntDesign name="delete" size={20} color="white" />
                    <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#666',
    },
    value: {
        flex: 2,
        fontSize: 16,
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});