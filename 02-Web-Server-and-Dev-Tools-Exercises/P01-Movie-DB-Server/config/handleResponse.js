const FS = require('fs');

function handleResponse(res, path, extension, content) {
    const READ = FS.createReadStream(path);

    res.writeHead(200, {
        'Content-Type': getContentType(extension)
    });

    if (extension === 'html') {
        READ.on('data', (data) => {
            if (data.toString().indexOf('{{replaceMe}}') !== -1) {
                data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', content);
            }

            res.write(data);
        });

        READ.on('end', () => {
            res.end();
        });
    } else {
        READ.on('open', () => {
            READ.pipe(res);
        });
    }

    READ.on('error', () => {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.write('404 not found!');
        res.end();
    });
}

function getContentType(ext) {
    if (ext === 'html') {
        return 'text/html';
    }

    let extension = ext.split('.').pop();

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
}

module.exports = handleResponse;