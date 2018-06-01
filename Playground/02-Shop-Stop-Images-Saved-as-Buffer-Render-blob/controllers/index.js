const HOME_CONTROLLER = require('./home');
const FILES_CONTROLLER = require('./static-files');
const PRODUCT_CONTROLLER = require('./product');
const ERROR_CONTROLLER = require('./error');

module.exports = [ 
    HOME_CONTROLLER, 
    FILES_CONTROLLER, 
    PRODUCT_CONTROLLER, 
    ERROR_CONTROLLER 
];