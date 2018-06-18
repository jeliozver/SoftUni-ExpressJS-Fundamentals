const ARTICLE = require('mongoose').model('Article');
const EDIT = require('mongoose').model('Edit');

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        ARTICLE.create({ title: req.body.title }).then((newArticle) => {
            EDIT.create({
                author: req.user.id,
                article: newArticle._id,
                content: req.body.content
            }).then((newEdit) => {
                newArticle.edits.push(newEdit._id);
                newArticle.save().then(() => {
                    req.session.msg = { success: 'Article created successfully!' };
                    res.redirect('/');
                });
            }).catch(() => {
                req.session.msg = { error: 'Article was not created!' };
                res.redirect('/');
            });
        }).catch(() => {
            req.session.msg = { error: 'Article was not created!' };
            res.redirect('/');
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id)
            .populate({ path: 'edits', options: { sort: { 'creationDate': -1 } } })
            .then((article) => {
                res.render('article/edit', { article });
            });
    },

    editPost: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id).then((article) => {
            EDIT.create({
                author: req.user.id,
                article: article._id,
                content: req.body.content
            }).then((newEdit) => {
                article.edits.push(newEdit._id);
                article.save().then(() => {
                    req.session.msg = { success: 'Article edited successfully!' };
                    res.redirect('/');
                });
            });
        });
    },

    lock: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id).then((article) => {
            article.locked = true;
            article.save().then(() => {
                req.session.msg = { success: 'Article locked successfully!' };
                res.redirect('/');
            });
        });
    },

    unlock: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id).then((article) => {
            article.locked = false;
            article.save().then(() => {
                req.session.msg = { success: 'Article unlocked successfully!' };
                res.redirect('/');
            });
        });
    },

    getAll: (req, res) => {
        ARTICLE.find({}).sort({ title: 1 }).then((articles) => {
            res.render('article/all-articles', { articles });
        });
    },

    getLatest: (req, res) => {
        ARTICLE.find({})
            .sort({ creationDate: -1 })
            .limit(1)
            .populate({ path: 'edits', options: { sort: { 'creationDate': -1 } } }).then((found) => {
                let article = found[0];
                let latestEdit = article.edits[0].content.split('\r\n\r\n');
                article['content'] = latestEdit;
                res.render('article/details', { article });
            });
    },

    getSingle: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id)
            .populate({ path: 'edits', options: { sort: { 'creationDate': -1 } } })
            .then((article) => {
                let latestEdit = article.edits[0].content.split('\r\n\r\n');
                article['content'] = latestEdit;
                res.render('article/details', { article });

            }).catch(() => {
                res.sendStatus(400);
            });
    },

    getSingleEdit: (req, res) => {
        let id = req.params.id;
        EDIT.findById(id).populate('article').then((edit) => {
            let contentSplited = edit.content.split('\r\n\r\n');
            edit['contentSplited'] = contentSplited;
            res.render('article/details-edit', { edit });
        });
    },

    getHistory: (req, res) => {
        let id = req.params.id;
        ARTICLE.findById(id)
            .populate({ path: 'edits', options: { populate: { path: 'author' }, sort: { 'creationDate': -1 } } })
            .then((article) => {
                res.render('article/history', { article });
            });

    },

    search: (req, res) => {
        let criteria = req.body.title.toLowerCase();
        if (criteria === '') {
            res.redirect('/article/all');
        } else {
            ARTICLE.find({ 'title': { '$regex': `${criteria}`, '$options': 'i' } }).then((articles) => {
                res.render('article/search-results', { criteria, articles });
            });
        }
    }
};