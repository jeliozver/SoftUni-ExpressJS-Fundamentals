const MONGOOSE = require('mongoose');
MONGOOSE.Promise = global.Promise;

module.exports = (config) => {
    MONGOOSE.connect(config.connectionString);

    let db = MONGOOSE.connection;

    db.once('open', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('MongoDB is ready!');
    });
    
    require('../models/Product');
};