import { create } from "zustand";
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-toastify';
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
    groups: [],

    createGroup: async (data) => {
        try {
            const { groups } = get();
            const response = await axiosInstance.post('/group/create', data);
            const newGroup = response.data.groupData;
            set({ groups: [...groups, newGroup] });
            const socket = useAuthStore.getState().socket;
            socket.emit('joinGroup', newGroup._id);
            toast.success(response.data.message, { theme: 'dark' });
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
        }
    },
    getAllGroups: async () => {
        try {
            const response = await axiosInstance.get('/group/allGroups');
            set({ groups: response.data })
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
        }
    },
    deleteGroup: async (groupId) => {
        try {
            const response = await axiosInstance.delete(`/group/deleteGroup/${groupId}`);
            toast.success(response.data.message, { theme: "dark" });
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
        }
    }

}))