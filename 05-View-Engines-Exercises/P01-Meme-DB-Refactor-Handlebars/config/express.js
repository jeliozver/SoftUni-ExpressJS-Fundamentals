const EXPRESS = require('express');
const PATH = require('path');
const BODY_PARSER = require('body-parser');
const HANDLEBARS = require('express-handlebars');

module.exports = (APP, CONFIG) => {
    APP.engine('.hbs', HANDLEBARS({
        extname: '.hbs',
        defaultLayout: 'layout',
        partialsDir: 'views/partials/'
    }));

    APP.set('views', PATH.join(CONFIG.rootPath, '/views'));
    APP.set('view engine', '.hbs');

    APP.use(BODY_PARSER.urlencoded({ extended: true }));

    APP.use(EXPRESS.static(
        PATH.normalize(PATH.join(CONFIG.rootPath, 'public')))
    );
};