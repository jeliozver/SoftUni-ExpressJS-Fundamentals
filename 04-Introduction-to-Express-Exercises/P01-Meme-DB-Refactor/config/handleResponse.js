const FS = require('fs');

module.exports = {
    handleResponse: (res, path, content) => {
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
                'Content-Type': 'text/html'
            });

            data = data.replace('<div id="replaceMe">{{replaceMe}}</div>', content);
            res.write(data);
            res.end();
        });
    }
};