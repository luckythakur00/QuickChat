import jwt from "jsonwebtoken";

const generateToken = (user) => {
    try {
        return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY)
    } catch (error) {
        console.log(error.message);
    }
}

export default generateToken