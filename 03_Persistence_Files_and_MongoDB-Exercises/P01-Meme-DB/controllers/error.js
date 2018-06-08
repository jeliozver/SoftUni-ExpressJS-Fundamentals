module.exports = (req, res) => {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    res.write('404 not found!');
    res.end();

    return true;
};