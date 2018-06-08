const HOME_CONTROLLER = require('./home');
const FILES_CONTROLLER = require('./static-files');
const MEME_CONTROLLER = require('./meme');
const ERROR_CONTROLLER = require('./error');

module.exports = [
    HOME_CONTROLLER,
    FILES_CONTROLLER,
    MEME_CONTROLLER,
    ERROR_CONTROLLER
];