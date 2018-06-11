const GENRE_CONTROLLER = require('../controllers/genre');
const MEME_CONTROLLER = require('../controllers/meme');

module.exports = (APP) => {
    APP.post('/api/genre', GENRE_CONTROLLER.create);
    APP.get('/api/genre', GENRE_CONTROLLER.getAll);
    APP.get('/api/genre/:id', GENRE_CONTROLLER.getSingle);
    APP.put('/api/genre/:id', GENRE_CONTROLLER.update);
    APP.delete('/api/genre/:id', GENRE_CONTROLLER.delete);
    
    APP.post('/api/meme', MEME_CONTROLLER.create);
    APP.get('/api/meme', MEME_CONTROLLER.get);
    APP.get('/api/meme/:id', MEME_CONTROLLER.getSingle);
    APP.put('/api/meme/:id', MEME_CONTROLLER.update);
    APP.delete('/api/meme/:id', MEME_CONTROLLER.delete);
};