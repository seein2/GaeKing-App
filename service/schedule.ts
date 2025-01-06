import api from "./api";

const schedule = {
    create: async (scheduleData: ScheduleCreate): Promise<ScheduleResponse> => {
        try {
            const response = await api.post('/schedule', scheduleData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    list: async (date: string): Promise<ScheduleResponse> => {
        try {
            const response = await api.get('/schedule', {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    info: async (scheduleId: number): Promise<ScheduleDetail> => {
        try {
            const response = await api.get(`/schedule/${scheduleId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (
        scheduleId: number,
        updateData: Partial<Omit<ScheduleCreate, 'dogId'>>
    ): Promise<ScheduleResponse> => {
        try {
            const response = await api.put(`/schedule/${scheduleId}`, updateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (scheduleId: number): Promise<ScheduleResponse> => {
        try {
            const response = await api.delete(`/schedule/${scheduleId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCompletion: async (completionData: ScheduleCompletionUpdate): Promise<ScheduleResponse> => {
        try {
            const response = await api.patch(
                `/schedule/${completionData.schedule_id}/completion`,
                {
                    completion_time: completionData.completion_time,
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