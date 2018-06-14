const HOME_CONTROLLER = require('../controllers/home');
const USER_CONTROLLER = require('../controllers/user');
const CAR_CONTROLLER = require('../controllers/car');
const AUTH = require('./auth');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/user/register', USER_CONTROLLER.registerGet);
    APP.post('/user/register', USER_CONTROLLER.registerPost);
    APP.get('/user/login', USER_CONTROLLER.loginGet);
    APP.post('/user/login', USER_CONTROLLER.loginPost);
    APP.post('/user/logout', AUTH.isAuth, USER_CONTROLLER.logout);
    APP.get('/user/:id', AUTH.isAuth, AUTH.isSameUser, USER_CONTROLLER.userDetails);

    APP.get('/cars/all', CAR_CONTROLLER.getAllCars);
    APP.post('/search', CAR_CONTROLLER.search);
    APP.get('/search', CAR_CONTROLLER.search);

    APP.get('/cars/add', AUTH.isInRole('Admin'), CAR_CONTROLLER.addCarGet);
    APP.post('/cars/add', AUTH.isInRole('Admin'), CAR_CONTROLLER.addCarPost);
    APP.get('/cars/edit/:id', AUTH.isInRole('Admin'), CAR_CONTROLLER.editCarGet);
    APP.post('/cars/edit/:id', AUTH.isInRole('Admin'), CAR_CONTROLLER.editCarPost);

    APP.get('/cars/rent/:id', AUTH.isAuth, CAR_CONTROLLER.rentCarGet);
    APP.post('/cars/rent/:id', AUTH.isAuth, CAR_CONTROLLER.rentCarPost);
};