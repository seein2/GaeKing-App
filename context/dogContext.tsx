import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

interface DogContextType {
    dog: Dog | null;
    setDog: (dog: Dog | null) => Promise<void>;
}

// Context 생성 시 타입 명시적 지정 및 초기값 설정
const DogContext = createContext<DogContextType | null>(null);

export function DogProvider({ children }: { children: React.ReactNode }) {
    const [dog, setDog] = useState<Dog | null>(null);

    // 초기 로드
    useEffect(() => {
        const loadDog = async () => {
            try {
                const savedDog = await AsyncStorage.getItem('dog');
                if (savedDog) {
                    setDog(JSON.parse(savedDog));
                }
            } catch (error) {
                console.error('강아지 로딩 실패:', error);
            }
        };
        loadDog();
    }, []);

    // setDog를 래핑하여 AsyncStorage에도 저장
    const setAndSaveDog = async (newDog: Dog | null) => {
        try {
            if (newDog) {
                await AsyncStorage.setItem('dog', JSON.stringify(newDog));
            } else {
                await AsyncStorage.removeItem('dog');
            }
            setDog(newDog);
        } catch (error) {
            console.error('강아지 저장 오류:', error);
        }
    };

    return (
        <DogContext.Provider value={{ dog, setDog: setAndSaveDog }}>
            {children}
        </DogContext.Provider>
    );
}

export function useDog() {
    const context = useContext(DogContext);
    if (context === null) {
        throw new Error('useDog는 DogProvider안에서 사용되어야 합니다.');
    }
    return context;
}