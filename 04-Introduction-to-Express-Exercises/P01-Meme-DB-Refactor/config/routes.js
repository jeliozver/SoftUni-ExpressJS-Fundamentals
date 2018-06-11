const HOME_CONTROLLER = require('../controllers/home');
const GENRE_CONTROLLER = require('../controllers/genre');
const MEME_CONTROLLER = require('../controllers/meme');

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/addGenre', GENRE_CONTROLLER.addGenreGet);
    APP.post('/addGenre', GENRE_CONTROLLER.addGenrePost);

    APP.get('/addMeme', MEME_CONTROLLER.addMemeGet);
    APP.post('/addMeme', MEME_CONTROLLER.addMemePost);

    APP.get('/viewAllMemes', MEME_CONTROLLER.viewAll);
    APP.get('/getDetails/:id', MEME_CONTROLLER.viewDetails);
    APP.get('/download/:path', MEME_CONTROLLER.downloadMeme);
    APP.get('/vote/:id', MEME_CONTROLLER.voteMeme);

    APP.get('/searchMeme', MEME_CONTROLLER.searchMemeGet);
    APP.post('/searchMeme', MEME_CONTROLLER.searchMemePost);
};