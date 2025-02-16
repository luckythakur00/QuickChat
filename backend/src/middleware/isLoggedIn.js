import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const isLoggedIn = async (req, res, next) => {
    if (!req.cookies.token || req.cookies.token === '') {
        return res.status(400).json({ message: "You Don't have token" });
    }
    try {
        let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        if (!data) {
            return res.status(400).json({ message: "Invalid token" });
        }
        let user = await User.findOne({ email: data.email }).select("-password");
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error! in isLoggedIn middleware" })
    }
}

export default isLoggedIn;