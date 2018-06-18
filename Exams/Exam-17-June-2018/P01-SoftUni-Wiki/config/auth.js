const ROLE = require('mongoose').model('Role');
const ARTICLE = require('mongoose').model('Article');

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

    isLocked: (req, res, next) => {
        let id = req.params.id;
        ARTICLE.findById(id).then((article) => {
            if (!article.locked) {
                next();
            } else {
                if (req.user.isAdmin) {
                    next();
                } else {
                    res.redirect('/user/login');
                }
            }
        });
    }
};