import { ImagePickerAsset } from "expo-image-picker";
import api from "./api";

interface DogResponse {
    success: boolean;
    message: string;
    result?: Dog;
}

const dog = {
    register: async (
        dog_name: string,
        birth_date: Date,
        breed_type: string,
        gender: "남자" | "여자",
        profile_image?: ImagePickerAsset
    ): Promise<DogResponse> => {
        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append('dog_name', dog_name);
            formData.append('birth_date', birth_date.toISOString());
            formData.append('breed_type', breed_type);
            formData.append('gender', gender);

            // 이미지가 있는 경우에만 추가
            if (profile_image) {
                // 1. 이미지의 실제 경로 가져오기
                const imageUri = profile_image.uri;
                
                // 2. 파일 이름 추출 (경로의 마지막 부분을 가져옴)
                // 예: "file:///data/.../image.jpg" -> "image.jpg"
                const fileName = imageUri.split('/').pop() || 'photo.jpg';
                
                // 3. 파일 확장자로부터 MIME 타입 추출
                // 예: "image.jpg" -> "image/jpeg"
                const match = /\.(\w+)$/.exec(fileName);
                const type = match ? `image/${match[1]}` : 'image';
                
                // 4. 서버가 이해할 수 있는 형식으로 포맷팅
                formData.append('profile_image', {
                    uri: imageUri,    // 실제 파일 경로
                    name: fileName,   // 파일 이름
                    type: type,       // MIME 타입
                } as any);
            }

            const response = await api.post('/dog/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // multipart/form-data로 전송
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    info: async (): Promise<DogResponse> => {
        try {
            const response = await api.get('/dog/info');
            return response.data
        } catch (error) {
            throw error;
        }
    }
};

export default dog;