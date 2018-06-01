const HTTP = require('http');
const URL = require('url');
const QS = require('querystring');
const CONTROLLERS = require('./controllers');
const CONFIG = require('./config/config');
const DB = require('./config/database.config');
const PORT = 8080;

let env = process.env.NODE_ENV || 'development';
DB(CONFIG[env]);

const SERVER = HTTP.createServer((req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;
    req.query = QS.parse(URL.parse(req.url).query).query;
    
    for (let controller of CONTROLLERS) {
        if (!controller(req, res)) {
            break;
        }
    }
});

SERVER.listen(PORT);

console.log(`Server is listening on port: ${PORT}`);