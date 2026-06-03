
const { validationResult } = require("express-validator");
const user = require("../models/user.model");
const refreshTokenModel = require("../models/refreshToken.model");
const jwt = require("jsonwebtoken");

// ── helper: set cookies + return user ────────────────────────────────────────
async function setTokenAndGetUserDetails(res, User) {
    const { refreshToken, accessToken } = User.generateAuthToken();
    const tokenDoc = new refreshTokenModel({ token: refreshToken, userid: User._id });
    await tokenDoc.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, sameSite: "None", secure: true,
        maxAge: 60 * 1000 * 60 * 24 * 7,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, sameSite: "None", secure: true,
        maxAge: 60 * 1000 * 60,
    });

    const { password: _, ...userDetails } = User.toObject();
    return userDetails;
}

module.exports.registerUser = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

        const { fullname: { firstname, lastname }, email, password } = req.body;

        const isUserExist = await user.findOne({ email });
        if (isUserExist) return res.status(400).json({ message: "User already exist" });

        const hashedPassword = await user.hashPassword(password);
        const NewUser = await user.create({ fullname: { firstname, lastname }, email, password: hashedPassword });

        const userDetails = await setTokenAndGetUserDetails(res, NewUser);
        res.status(201).json(userDetails);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.userLogin = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

        const { email, password } = req.body;
        const User = await user.findOne({ email }).select("+password");

        if (!User) return res.status(401).json({ message: "Email does not exist" });

        // Google-only account trying to login with password
        if (User.authProvider === "google" && !User.password) {
            return res.status(401).json({ message: "This account uses Google login. Please sign in with Google." });
        }

        const isMatch = await User.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const userDetails = await setTokenAndGetUserDetails(res, User);
        res.status(200).json(userDetails);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ── Google OAuth callback ─────────────────────────────────────────────────────
// Called by passport after Google verifies the user
module.exports.googleAuthCallback = async (req, res) => {
    try {
        const User = req.user; 
        const { refreshToken, accessToken } = User.generateAuthToken();

        const tokenDoc = new refreshTokenModel({ token: refreshToken, userid: User._id });
        await tokenDoc.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, sameSite: "None", secure: true,
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true, sameSite: "None", secure: true,
            maxAge: 60 * 1000 * 60,
        });

        // Redirect to frontend — frontend will call /user/profile to get user data
        res.redirect(`${process.env.FRONTEND_URL}/auth/google/success`);
    } catch (e) {
        console.log(e.message);
        res.redirect(`${process.env.FRONTEND_URL}/user/login?error=google_failed`);
    }
};

module.exports.userLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    await refreshTokenModel.deleteOne({ token: refreshToken });
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logout Successful" });
};

module.exports.generateAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.headers?.authorization?.split(" ")[1];
    if (!refreshToken) return res.status(400).json({ error: "Bad request, Token missing" });

    const isTokenExist = await refreshTokenModel.findOne({ token: refreshToken });
    if (!isTokenExist) {
        res.clearCookie("refreshToken");
        return res.status(401).json({ error: "Unauthorized, Invalid Token" });
    }
    try {
        const tokenPayload = jwt.verify(refreshToken, process.env.SECRET_KEY);
        if (tokenPayload.type === "refreshToken") {
            const accessToken = jwt.sign({ _id: tokenPayload._id, type: "accessToken" }, process.env.SECRET_KEY, { expiresIn: "30m" });
            res.cookie("accessToken", accessToken,{
            httpOnly: true, sameSite: "None", secure: true,
            maxAge: 60 * 1000 * 60,
        });
            return res.status(200).json({ message: "accessToken created", accessToken });
        }
        return res.status(401).json({ error: "Invalid token type" });
    } catch (e) {
        res.status(401).json({ error: "Unauthorized, Token expired" });
    }
};

module.exports.getAllUserBySearch = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { "fullname.firstname": { $regex: req.query.search.trim(), $options: "i" } },
            { "fullname.lastname": { $regex: req.query.search.trim(), $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};
    const users = await user.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
};

module.exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const AllUsers = await user.find({ _id: { $ne: req.user._id } });
        return res.status(200).json(AllUsers);
    } catch (e) {
        return res.status(500).json({ message: "Failed to fetch all users", error: e.message });
    }
};