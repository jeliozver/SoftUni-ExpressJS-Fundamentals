const HTTP = require('http');
const URL = require('url');
const CONTROLLERS = require('./controllers');
const PORT = 3000;

const SERVER = HTTP.createServer((req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;
    for (let controller of CONTROLLERS) {
        if (!controller(req, res)) {
            break;
        }
    }
});

SERVER.listen(PORT);

console.log(`Server listening on port ${PORT}`);