const MONGOOSE = require('mongoose');
MONGOOSE.Promise = global.Promise;

module.exports = (config) => {
    return new Promise((resolve, reject) => {
        MONGOOSE.connect(config.connectionString);

        let db = MONGOOSE.connection;

        db.once('open', (err) => {
            if (err) {
                reject(err);
                return;
            }

            console.log('MongoDB is ready!');
            resolve();

        });

        db.on('error', (err) => {
            reject(err);
            return;
        });

        require('../models/Role').init();
        require('../models/User').init();
        require('../models/Product');
        require('../models/Category');
    });
};