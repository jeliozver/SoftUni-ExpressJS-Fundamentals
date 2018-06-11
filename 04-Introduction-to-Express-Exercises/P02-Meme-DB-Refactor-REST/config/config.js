const PATH = require('path');

module.exports = {
    development: {
        connectionString: 'mongodb://localhost:27017/MemeDB-REST',
        rootPath: PATH.normalize(PATH.join(__dirname, '../'))
    },
    production: {

    }
};