const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("../models/user.model");


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this googleId (login )
                let existingUser = await user.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                // Check if user exists with same email (Link the google account(google id ))
                let emailUser = await user.findOne({ email: profile.emails[0].value });
                if (emailUser) {
                    // Link google to existing account
                    emailUser.googleId = profile.id;
                    emailUser.authProvider = "google";
                    await emailUser.save();
                    return done(null, emailUser);
                }

                // Create new user
                const newUser = await user.create({
                    fullname: {
                        firstname: profile.name.givenName || profile.displayName,
                        lastname: profile.name.familyName || "",
                    },
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: "google",
                });

                return done(null, newUser);
            } catch (e) {
                return done(e, null);
            }
        }
    )
);



module.exports = passport;