import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isMessageLoading: false,

    getUsers: async () => {
        try {
            const response = await axiosInstance.get('/message/users');
            set({ users: response.data });
        } catch (error) {
            toast.error(error?.response?.data?.message, { theme: 'dark' });
            console.log("error in getUsers:", error.message);
        }
    },
    getMessages: async (userId) => {
        set({ isMessageLoading: true })
        try {
            const response = await axiosInstance.get(`/message/${userId}`)
            set({ messages: response.data });
        } catch (error) {
            toast.error(error?.response?.data?.message, { theme: 'dark' });
            console.log("Error in getMessages:: ", error.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            let response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, response.data] });
        } catch (error) {
            toast.error(error?.response?.data?.message, { theme: 'dark' })
            console.log("Error while sending message::", error.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            set({ messages: [...get().messages, newMessage] })
        })
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (clickedUserData) => {
        set({ selectedUser: clickedUserData })
    }
}))