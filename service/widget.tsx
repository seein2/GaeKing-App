import api from "./api";

const widget = {
    getSettings: async (dog_id: Number): Promise<WidgetResponse> => {
        try {
            const response = await api.get(`/widget/settings/${dog_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateSettings: async (dog_id: Number, data: WidgetTypes) => {
        try {
            const response = await api.post(`/widget/${dog_id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getActiveWidgets: async (dog_id: Number): Promise<ActiveWidgetsResponse> => {
        try {
            const response = await api.get(`/widget/active/${dog_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default widget;