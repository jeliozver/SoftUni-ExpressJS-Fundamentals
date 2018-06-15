const HOME_CONTROLLER = require('../controllers/home');
const USER_CONTROLLER = require('../controllers/user');
const FLIGHT_CONTROLLER = require('../controllers/flight');
const SEAT_CONTROLLER = require('../controllers/seat');
const AUTH = require('./auth');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/user/register', USER_CONTROLLER.registerGet);
    APP.post('/user/register', USER_CONTROLLER.registerPost);
    APP.get('/user/login', USER_CONTROLLER.loginGet);
    APP.post('/user/login', USER_CONTROLLER.loginPost);
    APP.post('/user/logout', AUTH.isAuth, USER_CONTROLLER.logout);
    APP.get('/user/cart', AUTH.isAuth, USER_CONTROLLER.cartGet);
    APP.post('/user/cart', AUTH.isAuth, USER_CONTROLLER.cartPost);
    APP.get('/user/ticket/buy/:id', AUTH.isAuth, USER_CONTROLLER.buyTicket);
    APP.get('/user/ticket/remove/:id', AUTH.isAuth, USER_CONTROLLER.removeTicket);
    APP.get('/user/profile', AUTH.isAuth, USER_CONTROLLER.profile);

    APP.get('/flight/add', AUTH.isInRole('Admin'), FLIGHT_CONTROLLER.addGet);
    APP.post('/flight/add', AUTH.isInRole('Admin'), FLIGHT_CONTROLLER.addPost);
    APP.get('/flight/edit/:id', AUTH.isInRole('Admin'), FLIGHT_CONTROLLER.editGet);
    APP.post('/flight/edit/:id', AUTH.isInRole('Admin'), FLIGHT_CONTROLLER.editPost);
    APP.post('/flight/publish/:id', AUTH.isInRole('Admin'), FLIGHT_CONTROLLER.publish);
    APP.get('/flight/details/:id', AUTH.isAuth, FLIGHT_CONTROLLER.detailsGet);

    APP.post('/seat/add', AUTH.isInRole('Admin'), SEAT_CONTROLLER.add);
    APP.get('/seat/delete/:id', AUTH.isInRole('Admin'), SEAT_CONTROLLER.remove);
};