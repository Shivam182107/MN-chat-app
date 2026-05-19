const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const { checkUserAuth } = require("../middlewares/auth.middleware");
const passport =require("../config/passport") 

const userRouter = express.Router();


userRouter.post("/register", [
    body("fullname.firstname").isLength({ min: 3 }).withMessage("Firstname must be 3 characters long"),
    body("email").isEmail().isLength({ min: 5 }).withMessage("Email must be 5 characters long"),
    body("password").isLength({ min: 8 }).withMessage("Password must be 8 characters long"),
], userController.registerUser);

userRouter.post("/login", [
    body("email").isEmail().isLength({ min: 5 }).withMessage("Email must be 5 characters long"),
    body("password").isLength({ min: 8 }).withMessage("Password must be 8 characters long"),
], userController.userLogin);

userRouter.get("/logout", checkUserAuth, userController.userLogout);
userRouter.post("/refresh", userController.generateAccessToken);
userRouter.get("/", checkUserAuth, userController.getAllUserBySearch);
userRouter.get("/profile", checkUserAuth, userController.getUserProfile);
userRouter.get("/all", checkUserAuth, userController.getAllUsers);


userRouter.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/user/login", session: false }),
    userController.googleAuthCallback
);

module.exports = userRouter;