import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useGroupStore } from "./useGroupStore";

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
        }
    },
    getMessages: async (userId) => {
        set({ isMessageLoading: true })
        try {
            const response = await axiosInstance.get(`/message/${userId}`)
            set({ messages: response.data });
        } catch (error) {
            toast.error(error?.response?.data?.message, { theme: 'dark' });
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages, getMessages } = get();
        try {
            let response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);

            const groups = useGroupStore.getState().groups;
            const isGroup = groups?.some(group => group._id === selectedUser._id);

            const socket = useAuthStore.getState().socket;
            socket.emit("sendMessage", { ...response.data, isGroup });
            set({ messages: [...messages, response.data] });
            getMessages(selectedUser._id)
        } catch (error) {
            toast.error(error?.response?.data?.message, { theme: 'dark' })
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("receivedOneToOneMessage", (newMessage) => {
            if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });

        socket.on("receivedGroupMessage", (newMessage) => {
            if (newMessage.receiverId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("receivedOneToOneMessage")
        socket.off("receivedGroupMessage")
    },

    setSelectedUser: (clickedUserData) => {
        set({ selectedUser: clickedUserData })
    }
}))