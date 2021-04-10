const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

const init = (passport) => {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                // Logic
                // Check if email exists
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, {
                        message: "No user exists with this email",
                    });
                }
                console.log(user);

                bcrypt
                    .compare(password, user.password)
                    .then((match) => {
                        console.log(match);
                        if (match) {
                            return done(null, user, {
                                message: "Logged in successfully",
                            });
                        }
                        return done(null, false, {
                            message: "Incorrect email or password",
                        });
                    })
                    .catch((err) => {
                        return done(null, false, {
                            message: "Something went wrong",
                        });
                    });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

module.exports = init;
