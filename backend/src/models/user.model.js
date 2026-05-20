const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            trim:true,
            required: true,
            minLength: [3, "firstname mustbe atlest 3 charecters long"]
        },
        lastname: {
            type: String,
            trim:true,
            // minLength: [3, "lastname mustbe atlest 3 charecters long"]
        }
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        minLength: [5, "Email must be 5 charecters long"]
    },
    password: {
        type: String,
        // required: true,
        trim:true,
        minLength: 8,
        select: false
    },
    pic: {
        type: "String",
        default:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE7C0855CpcwZfDmcJu6PJXD9Z79AWusBc7wnBIzz3LA&s',
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
        googleId: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    }

})
userSchema.methods.generateAuthToken = function () {
    const refreshToken = jwt.sign({ _id: this._id, type: "refreshToken" }, process.env.SECRET_KEY, { expiresIn: "7d" });
    const accessToken = jwt.sign({ _id: this._id, type: "accessToken" }, process.env.SECRET_KEY, { expiresIn: "30m" });
    return { refreshToken, accessToken }

}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);

}
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);

}
const user = mongoose.model("user", userSchema);
module.exports = user;


