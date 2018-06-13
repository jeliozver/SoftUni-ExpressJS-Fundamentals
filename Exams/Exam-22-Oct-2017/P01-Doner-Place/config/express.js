const EXPRESS = require('express');
const PATH = require('path');
const BODY_PARSER = require('body-parser');
const COOKIE_PARSER = require('cookie-parser');
const SESSION = require('express-session');
const PASSPORT = require('passport');
const HANDLEBARS = require('handlebars');
const EXPRESS_HANDLEBARS = require('express-handlebars');
const HELPERS = require('handlebars-helpers');
const COMPARISON = HELPERS.comparison();
const ROLE = require('mongoose').model('Role');

HANDLEBARS.registerHelper('dateFormat', require('handlebars-dateformat'));
HANDLEBARS.registerHelper('eq', COMPARISON.eq);

module.exports = (APP, CONFIG) => {
    APP.engine('.hbs', EXPRESS_HANDLEBARS({
        extname: '.hbs',
        defaultLayout: 'layout',
        partialsDir: 'views/partials/'
    }));

    APP.set('views', PATH.join(CONFIG.rootPath, '/views'));
    APP.set('view engine', '.hbs');

    APP.use(BODY_PARSER.urlencoded({ extended: true }));

    APP.use(COOKIE_PARSER());
    APP.use(SESSION({
        secret: '6b875ecdcb3d258f0e1155a3b75d9d79',
        cookie: { maxAge: 604800000 },
        saveUninitialized: false,
        resave: false
    }));
    APP.use(PASSPORT.initialize());
    APP.use(PASSPORT.session());

    APP.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;

            ROLE.findOne({ name: 'Admin' }).then((role) => {
                if (!role) {
                    next();
                }

                if (req.user.roles.indexOf(role._id) !== -1) {
                    req.user.isAdmin = true;
                    res.locals.admin = true;
                }

                next();
            });
        } else {
            next();
        }
    });

    APP.use(EXPRESS.static(
        PATH.normalize(PATH.join(CONFIG.rootPath, 'static')))
    );
};