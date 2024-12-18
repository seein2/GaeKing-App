import { createContext, useContext, useState } from 'react';

interface Pet {
    id?: string;
    pet_name: string;
    birth?: Date;
    breed?: string;
    gender?: 'male' | 'female';
    user_id: string;
}

interface PetContextType {
    pet: Pet | null;
    setPet: (pet: Pet | null) => void;
}

// Context 생성 시 타입 명시적 지정 및 초기값 설정
const PetContext = createContext<PetContextType | null>(null);

export function PetProvider({ children }: { children: React.ReactNode }) {
    const [pet, setPet] = useState<Pet | null>(null);

    return (
        <PetContext.Provider value={{ pet, setPet }}>
            {children}
        </PetContext.Provider>
    );
}

export function usePet() {
    const context = useContext(PetContext);
    if (context === null) {
        throw new Error('usePet must be used within a PetProvider');
    }
    return context;
}