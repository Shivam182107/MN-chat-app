const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("../models/user.model");
const refreshTokenModel = require("../models/refreshToken.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this googleId
                let existingUser = await user.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                // Check if user exists with same email (registered normally before)
                let emailUser = await user.findOne({ email: profile.emails[0].value });
                if (emailUser) {
                    // Link google to existing account
                    emailUser.googleId = profile.id;
                    emailUser.authProvider = "google";
                    if (profile.photos?.[0]?.value) emailUser.pic = profile.photos[0].value;
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
                    pic: profile.photos?.[0]?.value || undefined,
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

// Not using sessions — just need these as stubs for passport to work
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    const foundUser = await user.findById(id);
    done(null, foundUser);
});

module.exports = passport;