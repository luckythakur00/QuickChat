import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.join(userId);    // User join one-to-one messaging room.

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId); // User joins group room.
    });

    socket.on("sendMessage", (data) => {
        if (data.isGroup) {
            io.to(data.receiverId).emit("receivedGroupMessage", data);
        } else {
            io.to(data.receiverId).emit("receivedOneToOneMessage", data);
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server }