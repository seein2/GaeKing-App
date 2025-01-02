interface Dog {
    dog_id: number;
    dog_name: string;
    birth_date?: Date;
    breed_type?: string;
    gender?: "남자" | "여자";
    profile_image?: string;
};

interface DogProfile {
    success: boolean;
    message: string;
    result: {  // 서버에서 보내는 구조와 동일하게 수정
        dog: Dog;
        familyMembers: User[];
    };
};

interface DogResponse {
    success: boolean;
    message: string;
    result?: Dog[];
};
