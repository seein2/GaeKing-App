import React, { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { DogSelectionSheet } from './DogSelection';
import { TypeSelectionSheet } from './ScheduleType';
import { DetailsFormSheet } from './Detail';

interface ScheduleCreationFlowProps {
    selectedDate: string;
    onComplete: () => void;
    onClose: () => void;
    snapPercentage?: number;
}

export function ScheduleCreationFlow({ selectedDate, onComplete, onClose }: ScheduleCreationFlowProps) {
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

    return (
        <>
            <DogSelectionSheet
                ref={dogSelectionRef}
                onSelect={handleDogSelect}
                onClose={onClose}
                selectedDate={selectedDate}
            />

            {selectedDog && (
                <TypeSelectionSheet
                    ref={typeSelectionRef}
                    onSelect={handleTypeSelect}
                    onClose={onClose}
                    selectedDog={selectedDog}
                />
            )}

            {selectedDog && selectedType && (
                <DetailsFormSheet
                    ref={detailsFormRef}
                    onSubmit={handleDetailsSubmit}
                    onClose={onClose}
                    selectedDog={selectedDog}
                    selectedType={selectedType}
                />
            )}
        </>
    );
}