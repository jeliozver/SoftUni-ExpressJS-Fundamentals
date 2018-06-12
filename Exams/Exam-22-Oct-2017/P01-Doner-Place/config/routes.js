const HOME_CONTROLLER = require('../controllers/home');
const USER_CONTROLLER = require('../controllers/user');
const PRODUCT_CONTROLLER = require('../controllers/product');
const ORDER_CONTROLLER = require('../controllers/order');
const AUTH = require('./auth');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/user/register', USER_CONTROLLER.registerGet);
    APP.post('/user/register', USER_CONTROLLER.registerPost);
    APP.get('/user/login', USER_CONTROLLER.loginGet);
    APP.post('/user/login', USER_CONTROLLER.loginPost);
    APP.post('/user/logout', AUTH.isAuth, USER_CONTROLLER.logout);

    APP.get('/product/create', AUTH.isInRole('Admin'), PRODUCT_CONTROLLER.createGet);
    APP.post('/product/create', AUTH.isInRole('Admin'), PRODUCT_CONTROLLER.createPost);
    APP.get('/order/all', AUTH.isInRole('Admin'), ORDER_CONTROLLER.orderAllGet);
    APP.post('/order/all', AUTH.isInRole('Admin'), ORDER_CONTROLLER.orderAllPost);

    APP.get('/order/customize/:id', AUTH.isAuth, ORDER_CONTROLLER.orderGet);
    APP.post('/order/customize', AUTH.isAuth, ORDER_CONTROLLER.orderPost);
    APP.get('/order/details/:id', AUTH.isAuth, ORDER_CONTROLLER.orderDetails);
    APP.get('/order/status', AUTH.isAuth, ORDER_CONTROLLER.orderStatus);
};