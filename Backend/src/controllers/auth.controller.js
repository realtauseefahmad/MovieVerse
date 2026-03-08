const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function userRegister(req, res) {

    const { username, email, password } = req.body;

    const isExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (isExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    res.status(201).json({
        message: "User Register Successfully",
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })
}


async function userLogin(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    if (user.isBanned) {
        return res.status(403).json({
            success: false,
            message: "Your account has been banned"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    res.status(201).json({
        message: "User Logged In Successfully",
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    })
}

async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: "Your account has been banned"
            });
        }
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = {
    userRegister,
    userLogin,
    getProfile
}