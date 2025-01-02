import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

interface DogContextType {
    dogs: Dog[];
    setDogs: (dogs: Dog[]) => Promise<void>;
}

const DogContext = createContext<DogContextType | null>(null);

export function DogProvider({ children }: { children: React.ReactNode }) {
    const [dogs, setDogs] = useState<Dog[]>([]);

    useEffect(() => {
        const loadDogs = async () => {
            try {
                const savedDogs = await AsyncStorage.getItem('dogs');
                if (savedDogs) {
                    setDogs(JSON.parse(savedDogs));
                }
            } catch (error) {
                console.error('강아지 목록 로딩 실패:', error);
            }
        };
        loadDogs();
    }, []);

    const setAndSaveDogs = async (newDogs: Dog[]) => {
        try {
            await AsyncStorage.setItem('dogs', JSON.stringify(newDogs));
            setDogs(newDogs);
        } catch (error) {
            console.error('강아지 목록 저장 오류:', error);
        }
    };

    return (
        <DogContext.Provider value={{ dogs, setDogs: setAndSaveDogs }}>
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