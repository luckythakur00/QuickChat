import Group from "../models/groupModel.js";

const createGroup = async (req, res) => {
    try {
        const { groupName, members } = req.body;
        const admin = req.user._id;

        const newGroup = await Group.create({
            groupName,
            admin,
            members,
        });

        const createdGroup = await Group.findById(newGroup._id).populate("members", "fullName profilePic");
        res.status(200).json({ message: "Group Created", groupData: createdGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
};

const allGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate("members", "fullName profilePic");
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
};

const dltGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        await Group.findByIdAndDelete(groupId)
        res.status(200).json({ message: 'Group Deleted' });
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
}

export { createGroup, allGroups, dltGroup };