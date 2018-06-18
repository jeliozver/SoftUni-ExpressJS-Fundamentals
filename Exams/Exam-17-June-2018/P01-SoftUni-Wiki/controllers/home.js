const ARTICLE = require('mongoose').model('Article');

module.exports = {
    index: (req, res) => {
        if (req.session.msg) {
            getArticles().then(({latest, articles}) => {
                let msg = req.session.msg;
                req.session.msg = undefined;
                res.render('home/index', { msg, latest, articles });
            }).catch(() => {
                req.session.msg = { error: 'Error: 400 - Bad Request!' };
                res.redirect('/');
            });
        } else {
            getArticles().then(({latest, articles}) => {
                res.render('home/index', { latest, articles });
            }).catch(() => {
                req.session.msg = { error: 'Error: 400 - Bad Request!' };
                res.redirect('/');
            });
        }
    }
};

function getArticles() {
    return new Promise((resolve, reject) => {
        ARTICLE.find({})
            .sort({ creationDate: -1 })
            .limit(4)
            .populate({ path: 'edits', options: { sort: { 'creationDate': -1 } } })
            .then((articles) => {
                if (articles.length >= 1) {
                    let latest = articles.shift();
                    let words = latest.edits[0].content
                        .split(/(\w+)/g)
                        .filter(e => e !== ' ')
                        .slice(0, 50)
                        .join(' ');
                        
                    latest.edits[0].content = words;
                    resolve({latest, articles});
                } else {
                    resolve({});
                }
            }).catch(() => {
                reject();
            });
    });
}