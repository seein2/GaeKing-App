import { createContext, useContext, useState } from 'react';

interface User {
    id: string;
    user_name: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Context 생성 시 타입 명시적 지정 및 초기값 설정
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}