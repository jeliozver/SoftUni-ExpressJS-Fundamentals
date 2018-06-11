const EXPRESS = require('express');
const PATH = require('path');
const BODY_PARSER = require('body-parser');

module.exports = (APP, CONFIG) => {
    APP.use(BODY_PARSER.urlencoded({ extended: true }));
    
    APP.use(EXPRESS.static(
        PATH.normalize(PATH.join(CONFIG.rootPath, 'public')))
    );
};