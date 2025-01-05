import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';
import { DogSelectionSheet } from './DogSelection';
import { TypeSelectionSheet } from './ScheduleType';
import { DetailsFormSheet } from './Detail';

interface ScheduleCreationFlowProps {
    selectedDate: string;
    onComplete: () => void;
    onClose: () => void;
}

export function ScheduleCreationFlow({ selectedDate, onComplete, onClose }: ScheduleCreationFlowProps) {
    // 선택된 데이터 상태 관리
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    // 각 시트의 ref
    const dogSelectionRef = useRef<BottomSheet>(null);
    const typeSelectionRef = useRef<BottomSheet>(null);
    const detailsFormRef = useRef<BottomSheet>(null);

    useEffect(() => {
        // 약간의 지연을 주어 BottomSheet가 완전히 초기화된 후 snapToIndex를 호출
        setTimeout(() => {
            dogSelectionRef.current?.snapToIndex(3);
        }, 100);
    }, [selectedDate]);

    // 핸들러들
    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        setCurrentStep(2);
        dogSelectionRef.current?.close();
        setTimeout(() => typeSelectionRef.current?.expand(), 300);
    };

    const handleTypeSelect = (typeId: string) => {
        setSelectedType(typeId);
        setCurrentStep(3);
        typeSelectionRef.current?.close();
        setTimeout(() => detailsFormRef.current?.expand(), 300);
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

            // 상태 초기화
            setCurrentStep(1);
            setSelectedDog(null);
            setSelectedType(null);
            setTimeout(() => dogSelectionRef.current?.snapToIndex(3), 300);
        } catch (error) {
            console.error('일정 등록 실패:', error);
        }
    };

    const handleClose = () => {
        // 모든 시트를 닫고 상태 초기화
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