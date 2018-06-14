const ROLE = require('mongoose').model('Role');
const USER = require('mongoose').model('User');
const ENCRYPTION = require('../utilities/encryption');
const PASSPORT = require('passport');

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
        PASSPORT.authenticate('local', function (err, user, info) {
            if (err) {
                req.session.msg = { error: 'Authentication failed!' };
                return res.redirect('/user/login');
            }

            if (!user) {
                req.session.msg = { error: 'Invalid credentials!' };
                return res.redirect('/user/login');
            }

            req.logIn(user, function (err) {
                if (err) {
                    req.session.msg = { error: 'Authentication failed!' };
                    return res.redirect('/user/login');
                }

                req.session.msg = { success: 'Login successfull!' };
                return res.redirect('/');
            });
        })(req, res);
    },

    logout: (req, res) => {
        req.logout();
        req.session.msg = { success: 'Logout successfull!' };
        res.redirect('/');
    },

    userDetails: (req, res) => {
        USER.findById(req.user._id).populate('rentedCars').then((user) => {
            res.render('user/details', { cars: user.rentedCars });
        }).catch((err) => {
            console.log(err);
            req.session.msg = { error: '400 - Bad Request!' };
            res.redirect('/');
        });
    }
};