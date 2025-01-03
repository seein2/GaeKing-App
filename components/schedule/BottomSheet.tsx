import React, { useEffect, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { DogSelectionSheet } from './DogSelection';
import { TypeSelectionSheet } from './ScheduleType';
import { DetailsFormSheet } from './Detail';

interface ScheduleCreationFlowProps {
    selectedDate: string;
    onComplete: () => void;
    onClose: () => void;
}

export function ScheduleCreationFlow({ selectedDate, onComplete, onClose }: ScheduleCreationFlowProps) {

    // 날짜를 선택할 때마다 바텀시트가 올라오게
    useEffect(() => {
        dogSelectionRef.current?.snapToIndex(3);
    }, [selectedDate]);

    // 각 시트의 ref
    const dogSelectionRef = useRef<BottomSheet>(null);
    const typeSelectionRef = useRef<BottomSheet>(null);
    const detailsFormRef = useRef<BottomSheet>(null);

    // 선택된 데이터 상태 관리
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // 각 단계별 핸들러
    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        dogSelectionRef.current?.close();
        setTimeout(() => typeSelectionRef.current?.expand(), 300);
    };

    const handleTypeSelect = (typeId: string) => {
        setSelectedType(typeId);
        typeSelectionRef.current?.close();
        setTimeout(() => detailsFormRef.current?.expand(), 300);
    };

    const handleDetailsSubmit = async (details: {
        memo: string;
        repeat: string;
        notification: string;
    }) => {
        if (!selectedDog || !selectedType) return;

        try {
            // API 호출로 일정 등록
            // const response = await scheduleService.create({
            //     dogId: selectedDog.id,
            //     type: selectedType,
            //     date: selectedDate,
            //     ...details
            // });

            detailsFormRef.current?.close();
            onComplete();
        } catch (error) {
            console.error('일정 등록 실패:', error);
        }
    };
    const handleClose = () => {
        // 현재 열려있는 시트들을 닫음.
        detailsFormRef.current?.close();
        typeSelectionRef.current?.close();

        // 선택된 상태들을 초기화
        setSelectedDog(null);
        setSelectedType(null);

        // 300ms 후에 첫 번째 시트(DogSelectionSheet)를 열고 크기를 조정합니다
        setTimeout(() => {
            dogSelectionRef.current?.snapToIndex(0);
        }, 300);
    };

    return (
        <>
            <DogSelectionSheet
                ref={dogSelectionRef}
                onSelect={handleDogSelect}
                onClose={handleClose}
                selectedDate={selectedDate}
            />

            {selectedDog && (
                <TypeSelectionSheet
                    ref={typeSelectionRef}
                    onSelect={handleTypeSelect}
                    onClose={handleClose}
                    selectedDog={selectedDog}
                />
            )}

            {selectedDog && selectedType && (
                <DetailsFormSheet
                    ref={detailsFormRef}
                    onSubmit={handleDetailsSubmit}
                    onClose={handleClose}
                    selectedDog={selectedDog}
                    selectedType={selectedType}
                />
            )}
        </>
    );
}