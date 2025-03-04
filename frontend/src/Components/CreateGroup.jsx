import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import sideImg from "../assets/profilePic.webp";

function CreateGroup({ isModalOpen, setIsModalOpen }) {
    const { getUsers, users } = useChatStore();
    const { authUser, darkMode } = useAuthStore();
    const { createGroup, groups } = useGroupStore();

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
    }, []);

    const toggleUserSelection = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            toast.warn("Group name is required!", { theme: "dark" });
            return;
        }
        if (selectedMembers.length < 2) {
            toast.warn("Select at least two members!", { theme: "dark" });
            return;
        }

        try {
            if (groups.some(group => group.groupName === groupName)) {
                toast.warn('Group already exist', { theme: 'dark' });
                return;
            }
            await createGroup({ groupName, members: [...selectedMembers, authUser._id] });
            setIsModalOpen(false);
            setSelectedMembers([]);
            setGroupName('');
            navigate("/");
        } catch (error) {
            toast.error("Failed to create group!", { theme: "dark" });
        }
    };

    return (
        <>
            {
                isModalOpen && (
                    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className='bg-white text-black p-6 rounded-lg shadow-lg w-[95%] md:w-96'>
                            <h2 className="text-lg font-semibold mb-3">Create Group</h2>
                            <input type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full p-2 border border-gray-400 rounded mb-3" />

                            {/* User Selection */}
                            <div className="max-h-40 overflow-auto border p-2 rounded mb-3">
                                {
                                    users.length > 0 ? users.map(user => (
                                        <div key={user._id} className={`flex items-center p-2 cursor-pointer rounded ${selectedMembers.includes(user._id) ? "bg-gray-200" : ""}`} onClick={() => toggleUserSelection(user._id)}>
                                            <input type="checkbox" className="mr-2 cursor-pointer" checked={selectedMembers.includes(user._id)} readOnly />
                                            <img src={user.profilePic || sideImg} className="h-8 w-8 mr-2 rounded-full bg-gray-400 object-cover" />
                                            <h1 className="text-sm">{user.fullName}</h1>
                                        </div>
                                    )
                                    ) : <p className="text-gray-500 text-sm">No users available</p>
                                }
                            </div>

                            {/* Selected Members */}
                            {
                                selectedMembers.length > 0 &&
                                <div className="mb-3">
                                    <h3 className="text-sm font-medium mb-1">Selected Members:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {
                                            selectedMembers.map(userId => {
                                                const user = users.find((u) => u._id === userId);
                                                return user ? (
                                                    <div key={userId} className={`flex items-center gap-2 ${darkMode ? 'bg-green-500' : 'bg-purple-500 text-white'} px-2 py-1 rounded`}>
                                                        <span className="text-sm">{user.fullName}</span>
                                                    </div>
                                                ) : null;
                                            })
                                        }
                                    </div>
                                </div>
                            }

                            <div className="flex justify-between mt-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-black font-semibold bg-gray-300 rounded-lg hover:bg-gray-400" >Cancel</button>
                                <button onClick={handleCreate} className={`px-4 py-2 ${darkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600 text-white'} rounded-lg`}>Create Group</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default CreateGroup