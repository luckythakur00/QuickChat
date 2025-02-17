import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.MODE_ENV === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
})