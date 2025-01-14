import api from "./api";

const schedule = {
    create: async (scheduleData: ScheduleCreate): Promise<ScheduleResponse> => { // 하나의 객체로 받음.
        try {
            const response = await api.post('/schedule', scheduleData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    list: async (date: string): Promise<ScheduleResponse> => {
        try {
            const response = await api.get(`/schedule/list/${date}`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    detail: async (schedule_id: number, date: string): Promise<ScheduleResponse> => {
        try {
            const response = await api.get(`/schedule/${schedule_id}?date=${date}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (
        schedule_id: number,
        updateData: Partial<Omit<ScheduleCreate, 'dog_id'>>
    ): Promise<ScheduleResponse> => {
        try {
            const response = await api.put(`/schedule/${schedule_id}`, updateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (schedule_id: number): Promise<ScheduleResponse> => {
        try {
            const response = await api.delete(`/schedule/${schedule_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCompletion: async (completionData: ScheduleCompletionUpdate): Promise<ScheduleResponse> => {
        try {
            const response = await api.patch(
                `/schedule/${completionData.schedule_id}/${completionData.instance_id}`,
                {
                    is_completed: completionData.is_completed
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default schedule;