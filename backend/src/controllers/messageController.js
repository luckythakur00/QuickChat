import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import { getreceiverSocketId, io } from "../utils/socket.js";

const getUsersSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        let filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filterUsers)
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            let uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat_images"
            });
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // socket.io code here for sending message on real time to a perticular user.
        const receiverSocketId = getreceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error while sending message:", error);
        res.status(500).json({ message: "Server error!" });
    }
};

export { getUsersSideBar, getMessages, sendMessage }