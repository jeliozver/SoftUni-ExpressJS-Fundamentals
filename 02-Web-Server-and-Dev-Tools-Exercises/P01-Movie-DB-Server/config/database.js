const FS = require('fs');
const PATH = require('path');
const DB_PATH = PATH.join(__dirname, '/database.json');

function getMovies() {
    if (FS.existsSync(DB_PATH) === false) {
        FS.writeFileSync(DB_PATH, '[]');
        return [];
    }

    let json = FS.readFileSync(DB_PATH).toString() || '[]';
    return JSON.parse(json);
}

function saveMovies(movies) {
    let json = JSON.stringify(movies);
    FS.writeFileSync(DB_PATH, json);
}

module.exports.movies = {};

module.exports.movies.getAll = getMovies;

module.exports.movies.add = (movie) => {
    let movies = getMovies();

    movie.id = movies.length + 1;
    movies.push(movie);
    saveMovies(movies);
};

module.exports.movies.getSingle = (id) => {
    let movies = getMovies();
    let result = {};

    for (let movie of movies) {
        if (movie.id == id) {
            result = movie;
            break;
        }
    }

    return result;
};

module.exports.movies.getCount = () => {
    let movies = getMovies();
    return movies.length;
};