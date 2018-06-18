const HOME_CONTROLLER = require('../controllers/home');
const USER_CONTROLLER = require('../controllers/user');
const ARTICLE_CONTROLLER = require('../controllers/article');
const AUTH = require('./auth');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/user/register', USER_CONTROLLER.registerGet);
    APP.post('/user/register', USER_CONTROLLER.registerPost);
    APP.get('/user/login', USER_CONTROLLER.loginGet);
    APP.post('/user/login', USER_CONTROLLER.loginPost);
    APP.post('/user/logout', AUTH.isAuth, USER_CONTROLLER.logout);

    APP.get('/article/add', AUTH.isAuth, ARTICLE_CONTROLLER.createGet);
    APP.post('/article/add', AUTH.isAuth, ARTICLE_CONTROLLER.createPost);
    APP.get('/article/edit/:id', AUTH.isAuth, AUTH.isLocked, ARTICLE_CONTROLLER.editGet);
    APP.post('/article/edit/:id', AUTH.isAuth, AUTH.isLocked, ARTICLE_CONTROLLER.editPost);
    APP.get('/article/lock/:id', AUTH.isInRole('Admin'), ARTICLE_CONTROLLER.lock);
    APP.get('/article/unlock/:id', AUTH.isInRole('Admin'), ARTICLE_CONTROLLER.unlock);

    APP.get('/article/all', ARTICLE_CONTROLLER.getAll);
    APP.get('/article/latest', ARTICLE_CONTROLLER.getLatest);
    APP.get('/article/details/:id', ARTICLE_CONTROLLER.getSingle);
    APP.post('/article/search', ARTICLE_CONTROLLER.search);
    APP.get('/article/details/edit/:id', AUTH.isAuth, ARTICLE_CONTROLLER.getSingleEdit);
    APP.get('/article/history/:id', AUTH.isAuth, ARTICLE_CONTROLLER.getHistory);
};