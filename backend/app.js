require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require('./db/db');
const cookieParser = require("cookie-parser");      
const passport=require("./src/config/passport")
const userRouter = require('./src/routes/user.route');
const chatrouter = require('./src/routes/chat.route');
const messageRouter = require('./src/routes/message.route');
const notificationRouter = require('./src/routes/notification.route');
const callHistoryRouter = require('./src/routes/callhistory.route');

connectDb()
    .then(() => console.log("Successfully connected with database"))
    .catch(e => console.log(e.message));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
     origin: process.env.FRONTEND_URL,//"https://mn-chat-app.vercel.app" 
    credentials: true,
}));
app.use(cookieParser());

app.use(passport.initialize());


app.use("/user", userRouter);
app.use("/chat", chatrouter);
app.use("/message", messageRouter);
app.use("/notification", notificationRouter);
app.use("/history", callHistoryRouter);

app.get("/", (req, res) => {
    res.send("<h1>Welcome Shivam this is Chat app</h1>");
});
// console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);

module.exports = app;