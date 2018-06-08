const HOME_CONTROLLER = require('./home');
const IMAGE_CONTROLLER = require('./image');
const ADD_TAG_CONTROLLER = require('./addTag');
const SEARCH_CONTROLLER = require('./search');
const FILES_CONTROLLER = require('./static-files');
const ERROR_CONTROLLER = require('./error');

module.exports = [
    HOME_CONTROLLER,
    IMAGE_CONTROLLER,
    ADD_TAG_CONTROLLER,
    SEARCH_CONTROLLER,
    FILES_CONTROLLER,
    ERROR_CONTROLLER
];