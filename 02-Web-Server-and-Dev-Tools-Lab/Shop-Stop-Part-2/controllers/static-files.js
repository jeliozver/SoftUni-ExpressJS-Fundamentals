const HTTP = require('http');
const FS = require('fs');
const PATH = require('path');
const URL = require('url');

function getContentType(url) {
    let extension = url.split('.')[1];

    if (extension === 'css') {
        return 'text/css';
    } else if (extension === 'ico') {
        return 'image/x-icon';
    } else if (extension === 'jpg' || extension === 'jpeg') {
        return 'image/jpeg';
    } else if (extension === 'png') {
        return 'image/png';
    }

    return '';
}

/**
 * 
 * @param {HTTP.ClientRequest} req 
 * @param {HTTP.ClientResponse} res 
 */
module.exports = (req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;

    if (req.pathname.startsWith('/content/') && req.method === 'GET') {
        let filePath = PATH.normalize(PATH.join(__dirname, `..${req.pathname}`));
        const READ = FS.createReadStream(filePath);

        res.writeHead(200, {
            'Content-Type': getContentType(req.pathname)
        });

        READ.on('open', () => {
            READ.pipe(res);
        });

        READ.on('error', (err) => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('404 Resource not found!');
            res.end();
        });
    } else {
        return true;
    }
};