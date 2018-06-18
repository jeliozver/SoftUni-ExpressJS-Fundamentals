const ROLE = require('mongoose').model('Role');
const USER = require('mongoose').model('User');
const ENCRYPTION = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let user = req.body;

        if (user.password && user.password !== user.confirmedPassword) {
            user.error = 'Passwords do not match!';
            res.render('user/register', user);
            return;
        }

        let salt = ENCRYPTION.generateSalt();
        user.salt = salt;

        if (user.password) {
            let hashedPassword = ENCRYPTION.generateHashedPassword(salt, user.password);
            user.password = hashedPassword;
        }

        ROLE.findOne({ name: 'User' }).then((role) => {
            user.roles = [role._id];
            USER.create(user).then((newUser) => {
                role.users.push(newUser._id);
                role.save();
                req.logIn(newUser, (err) => {
                    if (err) {
                        res.render('user/register', { error: 'Authentication not working!' });
                        return;
                    }

                    req.session.msg = { success: 'Registration successfull!' };
                    res.redirect('/');
                });
            }).catch((err) => {
                user.error = err;
                res.render('user/register', user);
            });
        });
    },

    loginGet: (req, res) => {
        if (req.session.msg) {
            let msg = req.session.msg;

            req.session.msg = undefined;
            res.render('user/login', msg);
        } else {
            res.render('user/login');
        }
    },

    loginPost: (req, res) => {
        let userToLogin = req.body;

        USER.findOne({ email: userToLogin.email }).then((user) => {
            if (!user || !user.authenticate(userToLogin.password)) {
                res.render('user/login', { error: 'Invalid credentials!' });
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/login', { error: 'Authentication not working!' });
                    return;
                }

                req.session.msg = { success: 'Login successfull!' };
                res.redirect('/');
            });
        });
    },

    logout: (req, res) => {
        req.session.msg = { success: 'Logout successfull!' };
        req.logout();
        res.redirect('/');
    }
};