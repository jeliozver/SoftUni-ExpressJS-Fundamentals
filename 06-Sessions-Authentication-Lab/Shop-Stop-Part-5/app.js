const EXPRESS = require('express');
const CONFIG = require('./config/config');
const EXPRESS_CONFIG = require('./config/express');
const ROUTES = require('./config/routes');
const PASSPORT = require('./config/passport');
const DB = require('./config/database.config');
const PORT = 8080;

const APP = EXPRESS();
let env = 'development';

DB(CONFIG[env]).then(() => {

    EXPRESS_CONFIG(APP, CONFIG[env]);
    ROUTES(APP);
    PASSPORT();
    APP.listen(PORT);

    console.log(`Server is listening on port ${PORT}`);
}).catch((err) => {
    console.log(err);
    throw err;
});

module.exports = APP;