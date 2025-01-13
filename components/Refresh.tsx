// components/common/RefreshableFlatList.tsx
import React, { useState, useCallback } from 'react';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface RefreshableFlatListProps<T> extends Omit<FlatListProps<T>, 'refreshControl'> {
    onRefresh: () => Promise<void>;
}

export function RefreshableFlatList<T>({
    onRefresh,
    ...props
}: RefreshableFlatListProps<T>) {
    const [refreshing, setRefreshing] = useState(false);

    // Pull-to-refresh 처리
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } catch (error) {
            console.error('Refresh failed:', error);
        } finally {
            setRefreshing(false);
        }
    }, [onRefresh]);

    // 화면 포커스시 자동 새로고침
    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [onRefresh])
    );

    return (
        <FlatList
            {...props}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#007AFF']}
                    tintColor="#007AFF"
                />
            }
        />
    );
}