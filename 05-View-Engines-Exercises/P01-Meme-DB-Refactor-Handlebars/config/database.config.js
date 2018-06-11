const MONGOOSE = require('mongoose');
const GENRE = require('../models/Genre');
const MEME = require('../models/Meme');
MONGOOSE.Promise = global.Promise;

module.exports = {
    init: (config) => {
        return new Promise((resolve, reject) => {
            MONGOOSE.connect(config.connectionString);

            let db = MONGOOSE.connection;

            db.once('open', (err) => {
                if (err) {
                    reject(err);
                }

                console.log('MongoDB is ready!');
                resolve();
            });

            db.on('error', (err) => {
                reject(err);
            });
        });
    },

    addGenre: (genreName) => {
        return new Promise((resolve, reject) => {
            GENRE.create({ genreName: genreName }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getAllGenres: () => {
        return new Promise((resolve, reject) => {
            GENRE.find({}).then((genres) => {
                resolve(genres);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getGenreById: (id) => {
        return new Promise((resolve, reject) => {
            GENRE.findById(id).then((genre) => {
                resolve(genre);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    addMeme: (genreId, meme) => {
        return new Promise((resolve, reject) => {
            GENRE.findById(genreId).then((genre) => {
                if (!genre) {
                    reject('No such genre!');
                    return;
                }
                MEME.create(meme).then((newMeme) => {
                    GENRE.update({ _id: newMeme.genre }, { $push: { memes: newMeme._id } }).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getAllMemes: () => {
        return new Promise((resolve, reject) => {
            MEME.find({ privacy: 'on' }).sort({ dateStamp: -1 }).then((memes) => {
                resolve(memes);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getMemeById: (id) => {
        return new Promise((resolve, reject) => {
            MEME.findById(id).then((meme) => {
                resolve(meme);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    voteForMeme: (id) => {
        return new Promise((resolve, reject) => {
            MEME.findByIdAndUpdate({ _id: id }, { $inc: { votes: 1 } })
                .then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
        });
    },

    searchMeme: (params) => {
        return new Promise((resolve, reject) => {
            let query = {};
            let genre = params.genre;
            let memeName = params.memeName;

            if (genre === 'all') {
                if (memeName !== '') {
                    query = { memeName: memeName, privacy: 'on' };
                } else {
                    query = { privacy: 'on' };
                }

                MEME.find(query).sort({ dateStamp: -1 }).then((memes) => {
                    resolve(memes);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                GENRE.findById(genre).populate('memes').then((result) => {
                    if (memeName === '') {
                        resolve(result.memes);
                    } else {
                        result.memes = result.memes.filter(m => m.memeName === memeName);
                        resolve(result.memes);
                    }
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }
};