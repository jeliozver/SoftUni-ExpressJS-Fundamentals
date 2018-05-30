const URL = require('url');
const PATH = require('path');
const DB = require('../config/database');
const FORMIDABLE = require('formidable');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    req.pathname = req.pathname || URL.parse(req.url).pathname;

    if (req.pathname === '/viewAllMovies' && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/viewAll.min.html'));
        let moviesSorted = DB.movies.getAll().sort((a, b) => b.movieYear - a.movieYear);
        let content = '';

        for (let movie of moviesSorted) {
            content += `<div class="movie">
            <a href="/movies/details/${movie.id}">
                <img class="moviePoster" src="${movie.moviePoster}"/>    
            </a>        
            </div>`;
        }

        HANDLE_RESPONSE(res, htmlPath, 'html', content);
    } else if (req.pathname.startsWith('/movies/details/') && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/details.min.html'));
        let id = Number(req.pathname.split('/')[3]);
        let movie = DB.movies.getSingle(id);
        let content = '';

        if (Object.keys(movie).length === 0) {
            content = '<div id="errBox"><h2 id="errMsg">There is no movie with such id in our Database!</h2></div>';
        } else {
            content = ` <div class="content">
            <img src="${movie.moviePoster}" alt="" />
            <h3>Title ${movie.movieTitle}</h3>
            <h3>Year ${movie.movieYear}</h3>
            <p> ${movie.movieDescription}</p>
            </div>`;
        }

        HANDLE_RESPONSE(res, htmlPath, 'html', content);
    } else if (req.pathname === '/addMovie' && req.method === 'GET') {
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/addMovie.min.html'));
        HANDLE_RESPONSE(res, htmlPath, 'html', '');
    } else if (req.pathname === '/addMovie' && req.method === 'POST') {
        const FORM = new FORMIDABLE.IncomingForm();
        let fields = {};
        let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/addMovie.min.html'));
        let content = '';

        FORM.on('field', (field, value) => {
            fields[field] = value;
        });

        FORM.on('end', () => {
            if (fields.movieTitle == '' || fields.moviePoster == '') {
                content = '<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>';
                HANDLE_RESPONSE(res, htmlPath, 'html', content);
            } else {
                DB.movies.add(fields);
                content = '<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>';
                HANDLE_RESPONSE(res, htmlPath, 'html', content);
            }
        });

        FORM.parse(req);
    } else {
        return true;
    }
};