const FS = require('fs');
const ZLIB = require('zlib');

function handleResponse(res, path, extension, content) {
    if (extension === 'html') {
        FS.readFile(path, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Encoding': 'gzip'
            });

            data = data.replace('<div id="replaceMe">{{replaceMe}}</div>', content);

            ZLIB.gzip(data, (err, result) => {
                if (err) {
                    console.log(err);
                    res.end();
                }

                res.write(result);
                res.end();
            });
        });
    } else {
        const READ = FS.createReadStream(path);
        let ext = extension.split('.')[1];
       
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
            res.writeHead(200, {
                'Content-Type': getContentType(extension),
                'Content-Disposition': `attachment; filename="${extension.split('/')[4]}"`
            });
        } else {
            res.writeHead(200, {
                'Content-Type': getContentType(extension)
            });
        }

        READ.on('open', () => {
            READ.pipe(res);
        });

        READ.on('error', () => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('404 not found!');
            res.end();
        });
    }
}

function getContentType(url) {
    let extension = url.split('.').pop();

    if (extension === 'css') {
        return 'text/css';
    } else if (extension === 'ico') {
        return 'image/x-icon';
    } else if (extension === 'jpg' || extension === 'jpeg') {
        return 'image/jpeg';
    } else if (extension === 'png') {
        return 'image/png';
    } else if (extension === 'js') {
        return 'application/javascript';
    }

    return '';
}

module.exports = handleResponse;