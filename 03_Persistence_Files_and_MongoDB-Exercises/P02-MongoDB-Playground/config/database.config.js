const MONGOOSE = require('mongoose');
const TAG = require('../models/Tag');
const IMAGE = require('../models/Image');
MONGOOSE.Promise = global.Promise;

module.exports.mongo = {};

module.exports.mongo.init = (config) => {
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
};

module.exports.mongo.getAllTags = () => {
    return new Promise((resolve, reject) => {
        TAG.find({}).then((tags) => {
            resolve(tags);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.getAllImages = () => {
    return new Promise((resolve, reject) => {
        IMAGE.find({}).then((images) => {
            resolve(images);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.searchByTagNameAndDate = (params) => {
    return new Promise((resolve, reject) => {
        TAG.find({ name: { $in: params.tags } }).then((tagsFound) => {
            let imageIds = [];
            for (let tag of tagsFound) {
                for (let id of tag.images) {
                    imageIds.push(id.toString());
                }
            }

            imageIds = imageIds.filter(onlyUnique);
            let query = {};
            if (params.after && params.before) {
                query = { _id: { $in: imageIds }, creationDate: { $gte: params.after, $lt: params.before } };
            } else if (params.after && !params.before) {
                query = { _id: { $in: imageIds }, creationDate: { $gte: params.after } };
            } else if (params.before && !params.after) {
                query = { _id: { $in: imageIds }, creationDate: { $lt: params.before } };
            } else {
                query = { _id: { $in: imageIds } };
            }

            IMAGE.find(query).sort({ creationDate: -1 }).limit(params.limit).then((imagesFound) => {
                resolve(imagesFound);
            }).catch((err) => {
                resolve(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.searchByDate = (params) => {
    return new Promise((resolve, reject) => {
        let query = {};
        if (params.after && params.before) {
            query = { creationDate: { $gte: params.after, $lt: params.before } };
        } else if (params.after && !params.before) {
            query = { creationDate: { $gte: params.after } };
        } else if (params.before && !params.after) {
            query = { creationDate: { $lt: params.before } };
        }

        IMAGE.find(query).sort({ creationDate: -1 }).limit(params.limit).then((imagesFound) => {
            resolve(imagesFound);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.addTag = (tagName) => {
    return new Promise((resolve, reject) => {
        TAG.findOne({ name: tagName }).then((tag) => {
            if (tag) {
                resolve();
                return;
            }
            TAG.create({ name: tagName }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.addImage = (image) => {
    return new Promise((resolve, reject) => {
        IMAGE.create(image).then((newImage) => {
            TAG.update({ _id: { $in: newImage.tags } }, 
                { $push: { images: newImage._id } }, 
                { multi: true }).then(() => {
                resolve();
            }).catch((err) => reject(err));
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.mongo.deleteImage = (imageId) => {
    return new Promise((resolve, reject) => {
        IMAGE.findByIdAndRemove(imageId).then((removedImage) => {
            TAG.update({ _id: { $in: removedImage.tags } }, 
                { $pull: { images: removedImage._id } }, 
                { multi: true }).then(() => {
                resolve();
            }).catch((err) => reject(err));
        }).catch((err) => {
            reject(err);
        });
    });
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}