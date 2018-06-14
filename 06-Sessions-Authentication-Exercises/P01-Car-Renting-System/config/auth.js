const ROLE = require('mongoose').model('Role');

module.exports = {
    isAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/user/login');
        }
    },

    isInRole: (role) => {
        return (req, res, next) => {
            if (req.user) {
                ROLE.findOne({ name: role }).then((role) => {
                    if (!role) {
                        res.redirect('/user/login');
                        return;
                    }

                    let isInRole = req.user.roles.indexOf(role._id) !== -1;
                    if (isInRole) {
                        next();
                    } else {
                        res.redirect('/user/login');
                        return;
                    }
                });
            } else {
                res.redirect('/user/login');
            }
        };
    },

    isSameUser: (req, res, next) => {
        if (req.user.id !== req.params.id) {
            res.redirect('/');
            return;
        }

        next();
    }
};