import React, { useEffect, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { DogSelectionSheet } from './DogSelection';
import { TypeSelectionSheet } from './ScheduleType';
import { DetailsFormSheet } from './Detail';
import scheduleService from '@/service/schedule';

interface ScheduleCreationFlowProps {
    selectedDate: string;
    onComplete: () => void;
    onClose: () => void;
}

export function ScheduleCreationFlow({ selectedDate, onComplete, onClose }: ScheduleCreationFlowProps) {
    // 선택된 데이터 상태 관리
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [selectedType, setSelectedType] = useState<ScheduleType | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    // 각 시트의 ref
    const dogSelectionRef = useRef<BottomSheet>(null);
    const typeSelectionRef = useRef<BottomSheet>(null);
    const detailsFormRef = useRef<BottomSheet>(null);

    useEffect(() => {
        setTimeout(() => {
            dogSelectionRef.current?.snapToIndex(1);
        }, 100);
    }, [selectedDate]);

    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        setCurrentStep(2);
        dogSelectionRef.current?.close();
        setTimeout(() => typeSelectionRef.current?.expand(), 200);
    };

    const handleTypeSelect = (type: ScheduleType) => {
        setSelectedType(type);
        setCurrentStep(3);
        typeSelectionRef.current?.close();
        setTimeout(() => detailsFormRef.current?.expand(), 200);
    };

    const handleDetailsSubmit = async (details: {
        description: string;
        repeat: {
            type: RepeatType;
            count?: number;
        };
        times: TimeSlot[];
        notification: {
            enabled: boolean;
            minutes: number;
        };
    }) => {
        if (!selectedDog || !selectedType) return;

        try {
            const scheduleData: ScheduleCreate = {
                dog_id: selectedDog.dog_id,
                type: selectedType,
                date: selectedDate,
                description: details.description,
                repeat: details.repeat,
                times: details.times,
                notification: details.notification
            };

            await scheduleService.create(scheduleData);
            
            detailsFormRef.current?.close();
            onComplete();

            // 상태 초기화
            setCurrentStep(1);
            setSelectedDog(null);
            setSelectedType(null);
            
            setTimeout(() => dogSelectionRef.current?.snapToIndex(3), 300);
        } catch (error) {
            console.error('일정 등록 실패:', error);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            typeSelectionRef.current?.close();
            setSelectedType(null);
            setCurrentStep(1);
            setTimeout(() => dogSelectionRef.current?.expand(), 300);
        } else if (currentStep === 3) {
            detailsFormRef.current?.close();
            setCurrentStep(2);
            setTimeout(() => typeSelectionRef.current?.expand(), 300);
        }
    };

    const handleClose = () => {
        detailsFormRef.current?.close();
        typeSelectionRef.current?.close();
        dogSelectionRef.current?.close();
        
        setSelectedDog(null);
        setSelectedType(null);
        setCurrentStep(1);
        
        onClose();
    };

    return (
        <>
            <DogSelectionSheet
                ref={dogSelectionRef}
                onSelect={handleDogSelect}
                onClose={handleClose}
                selectedDate={selectedDate}
            />

            {currentStep >= 2 && (
                <TypeSelectionSheet
                    ref={typeSelectionRef}
                    onSelect={handleTypeSelect}
                    onClose={handleClose}
                    onBack={handleBack}
                    selectedDog={selectedDog!}
                />
            )}

            {currentStep === 3 && (
                <DetailsFormSheet
                    ref={detailsFormRef}
                    onSubmit={handleDetailsSubmit}
                    onClose={handleClose}
                    onBack={handleBack}
                    selectedDog={selectedDog!}
                    selectedType={selectedType!}
                />
            )}
        </>
    );
}