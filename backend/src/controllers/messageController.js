import Group from "../models/groupModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

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
        const { id: chatId } = req.params; // Can be userId or groupId
        const myId = req.user._id;

        let messages;

        const group = await Group.findById(chatId);

        if (group) {
            if (!group.members.includes(myId)) {
                return res.status(403).json({ message: "User not in group" });
            }
            messages = await Message.find({ receiverId: chatId }).sort({ createdAt: 1 });
        } else {
            messages = await Message.find({
                $or: [
                    { senderId: myId, receiverId: chatId },
                    { senderId: chatId, receiverId: myId }
                ]
            }).sort({ createdAt: 1 })
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: roomId } = req.params;

        let imageUrl = null;
        if (image) {
            let uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat_images"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId: roomId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
};

export { getUsersSideBar, getMessages, sendMessage }