const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

const authController = () => {
    return {
        login(req, res) {
            res.render("auth/login");
        },
        postLogin(req, res, next) {
            const _getRedirectUrl = (req) => {
                return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
            }
            const { email, password } = req.body;

            // Validate request
            if (!email || !password) {
                req.flash("error", "All fields are required");
                req.flash("email", email);
                return res.redirect("/login");
            }
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    req.flash("error", info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash("error", info.message);
                    return res.redirect("/login");
                }
                req.login(user, (err) => {
                    if (err) {
                        req.flash("error", info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                });
            })(req, res, next);
        },
        register(req, res) {
            res.render("auth/register");
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;
            // Validate form as a request
            if (!name || !email || !password) {
                req.flash("error", "All fields are required");
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect("/register");
            }

            // Check that particular email exist already or not
            User.exists({ email: email }, (err, response) => {
                if (response) {
                    req.flash("error", "E-Mail is already regsitered");
                    req.flash("name", name);
                    req.flash("email", email);
                    return res.redirect("/register");
                }
            });

            // Hash a password before storing the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = new User({
                name,
                email,
                password: hashedPassword,
            });

            user.save()
                .then((user) => {
                    // Login the user to their respective account
                    return res.redirect("/");
                })
                .catch(() => {
                    req.flash("error", "Something went wrong");
                    return res.redirect("/register");
                });
        },
        logout(req, res) {
            req.logout();
            return res.redirect("/login");
        },
    };
};

module.exports = authController;
