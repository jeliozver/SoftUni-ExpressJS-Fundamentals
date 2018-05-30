const HEADER_CONTROLLER = require('./header');
const HOME_CONTROLLER = require('./home');
const FILES_CONTROLLER = require('./static-files');
const MOVIE_CONTROLLER = require('./movie');
const ERROR_CONTROLLER = require('./error');

module.exports = [
    HEADER_CONTROLLER,
    HOME_CONTROLLER,
    FILES_CONTROLLER,
    MOVIE_CONTROLLER,
    ERROR_CONTROLLER
];