import React, { useState, useCallback } from 'react';
import { ScrollView, ScrollViewProps, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface RefreshableScrollViewProps extends Omit<ScrollViewProps, 'refreshControl'> {
    onRefresh: () => Promise<void>;
}

export function RefreshableScrollView({
    onRefresh,
    children,
    ...props
}: RefreshableScrollViewProps) {
    const [refreshing, setRefreshing] = useState(false);

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

    // 화면에 포커스될 때만 새로고침
    useFocusEffect(
        useCallback(() => {
            handleRefresh();
        }, [])  // 의존성 배열을 비워서 화면 포커스시에만 실행
    );

    return (
        <ScrollView
            {...props}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#007AFF']}
                    tintColor="#007AFF"
                />
            }
        >
            {children}
        </ScrollView>
    );
}