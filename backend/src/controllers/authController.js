import cloudinary from "../utils/cloudinary.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

const signUpUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (fullName === "" || email === "" || password === "") {
        return res.status(400).json({ message: "Please enter all the details" });
    }
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be greater then 6 characters" });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already registered" });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(400).json({ message: "Something went wrong" });
                else {
                    const newUser = await User.create({
                        fullName,
                        email,
                        password: hash
                    })
                    let token = generateToken(newUser);
                    res.cookie('token', token);
                    res.status(200).json({
                        data: {
                            _id: newUser._id,
                            fullName: newUser.fullName,
                            email: newUser.email,
                            createdAt: newUser.createdAt
                        },
                        message: "User Created"
                    })
                }
            })
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" })
    }
}

const logInUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!" });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) res.status(400).json({ message: "Invalid credentials!" })
                if (!result) {
                    return res.status(400).json({ message: "Invalid credentials!" })
                }
                let token = generateToken(user);
                res.cookie('token', token);
                res.status(200).json({
                    data: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePic: user.profilePic,
                        createdAt: user.createdAt
                    }, message: "User logedIn"
                });
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error!" });
    }
}

const logOutUser = (req, res) => {
    try {
        res.cookie('token', '');
        res.status(200).json({ message: "User logout sucessfully!" })
    } catch (error) {
        res.status(500).json({ message: "Server Error!" })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({ message: "Server error!" });
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server Error!" })
    }
}

export { signUpUser, logInUser, logOutUser, updateProfile, checkAuth }