import { createContext, useContext, useState } from 'react';

interface DogContextType {
    dog: Dog | null;
    setDog: (dog: Dog | null) => void;
}

// Context 생성 시 타입 명시적 지정 및 초기값 설정
const DogContext = createContext<DogContextType | null>(null);

export function DogProvider({ children }: { children: React.ReactNode }) {
    const [dog, setDog] = useState<Dog | null>(null);

    return (
        <DogContext.Provider value={{ dog, setDog }}>
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