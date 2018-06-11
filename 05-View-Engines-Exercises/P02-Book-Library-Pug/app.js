const EXPRESS = require('express');
const EXPRESS_CONFIG = require('./config/express');
const ROUTES = require('./config/routes');
const CONFIG = require('./config/config');
const DB = require('./config/database.config');
const PORT = 8000;

const APP = EXPRESS();
let env = 'development';

DB.init(CONFIG[env]).then(() => {

    EXPRESS_CONFIG(APP, CONFIG[env]);
    ROUTES(APP);
    APP.listen(PORT);

    console.log(`Server is listening on port ${PORT}`);
}).catch((err) => {
    console.log(err);
});

module.exports = APP;