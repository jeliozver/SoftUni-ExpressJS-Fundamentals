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

    addGenre: (body) => {
        return new Promise((resolve, reject) => {
            GENRE.create({ genreName: body.genreName }).then((genre) => {
                resolve(genre);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getAllGenres: () => {
        return new Promise((resolve, reject) => {
            GENRE.find({}).populate('memes').then((genres) => {
                resolve(genres);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    getGenreById: (id) => {
        return new Promise((resolve, reject) => {
            GENRE.findById(id).populate('memes').then((genre) => {
                resolve(genre);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    updateGenre: (id, body) => {
        return new Promise((resolve, reject) => {
            GENRE.findByIdAndUpdate(id, { $set: { genreName: body.genreName } }, { new: true }).then((updatedGenre) => {
                resolve(updatedGenre);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    deleteGenre: (id) => {
        return new Promise((resolve, reject) => {
            GENRE.findByIdAndRemove(id).then((deletedGenre) => {
                if (!deletedGenre) {
                    reject('No such genre!');
                    return;
                }

                resolve(deletedGenre);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    addMeme: (memeInfo) => {
        return new Promise((resolve, reject) => {
            GENRE.findById(memeInfo.genre).then((genre) => {
                if (!genre) {
                    reject('No such genre!');
                    return;
                }
                MEME.create(memeInfo).then((newMeme) => {
                    GENRE.update({ _id: newMeme.genre }, { $push: { memes: newMeme._id } }).then(() => {
                        resolve(newMeme);
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

    getMemes: (params) => {
        return new Promise((resolve, reject) => {
            if (params.query || params.sort) {
                let query = undefined;
                let sort = undefined;
                
                if (params.query) {
                    query = JSON.parse(params.query);
                }
                
                if (params.sort) {
                    sort = JSON.parse(params.sort);
                }

                if (sort) {
                    MEME.find(query).sort(sort).then((memes) => {
                        resolve(memes);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    MEME.find(query).then((memes) => {
                        resolve(memes);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            } else {
                MEME.find({ privacy: 'off' }).populate('genre').then((memes) => {
                    resolve(memes);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    },

    getMemeById: (id) => {
        return new Promise((resolve, reject) => {
            MEME.findById(id).populate('genre').then((meme) => {
                resolve(meme);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    updateMeme: (id, body) => {
        return new Promise((resolve, reject) => {
            MEME.findById(id).then((meme) => {
                if (!meme) {
                    reject('No such Meme in DB!');
                    return;
                }

                meme.memeName = body.memeName;
                meme.description = body.description;
                meme.memeSrc = body.memeSrc;
                meme.privacy = body.privacy;
                if (body.genre.toString() !== meme.genre.toString()) {
                    Promise.all([
                        GENRE.update({ _id: meme.genre }, { $pull: { memes: meme._id } }),
                        GENRE.update({ _id: body.genre }, { $push: { memes: meme._id } })
                    ]).then(() => {
                        meme.genre = body.genre;
                        meme.save();
                        resolve(meme);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    meme.save();
                    resolve(meme);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },

    deleteMeme: (id) => {
        return new Promise((resolve, reject) => {
            MEME.findByIdAndRemove(id).then((removedMeme) => {
                if (!removedMeme) {
                    reject('No such meme!');
                    return;
                }
                GENRE.update({ _id: removedMeme.genre }, { $pull: { memes: removedMeme._id } })
                    .then(() => {
                        resolve(removedMeme);
                    }).catch((err) => {
                        reject(err);
                    });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};