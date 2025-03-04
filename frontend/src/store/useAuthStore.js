import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    darkMode: localStorage.getItem("theme") === "true",
    sideBar: true,

    checkAuth: async () => {
        try {
            let response = await axiosInstance.get('/auth/check')
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logOutUser: async () => {
        try {
            let response = await axiosInstance.get('/auth/logout')
            set({ authUser: null });
            toast.success(response?.data?.message, { theme: 'dark' });
            get().disconnectSocket();
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
        }
    },
    signUpUser: async (userData) => {
        try {
            let response = await axiosInstance.post('/auth/signup', userData)
            set({ authUser: response.data.data })
            toast.success(response?.data?.message, { theme: 'dark' });
            get().connectSocket()
        } catch (error) {
            toast.warn(error.response.data.message, { theme: 'dark' });
        }
    },
    logInUser: async (userData) => {
        try {
            let response = await axiosInstance.post('/auth/login', userData);
            set({ authUser: response.data?.data });
            toast.success(response?.data?.message, { theme: 'dark' });
            get().connectSocket()
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
            set({ authUser: null });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            let response = await axiosInstance.put('/auth/update-profile', data)
            set({ authUser: response.data });
            toast.success(response?.data?.message, { theme: 'dark' });
        } catch (error) {
            toast.warn(error?.response?.data?.message, { theme: 'dark' });
            console.log("Error in update profile: ", error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
        set({ socket: null });
    },


    setDarkMode: () => {
        const { darkMode } = get();
        const newTheme = !darkMode;
        localStorage.setItem("theme", newTheme);
        set({ darkMode: newTheme });
    },
    setSideBar: () => {
        const { sideBar } = get();
        set({ sideBar: !sideBar })
    },
}))