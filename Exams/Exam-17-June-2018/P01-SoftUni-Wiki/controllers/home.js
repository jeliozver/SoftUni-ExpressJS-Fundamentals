const ARTICLE = require('mongoose').model('Article');

// TODO FIX 50 WORDS THING

module.exports = {
    index: (req, res) => {
        if (req.session.msg) {
            getArticles().then((articles) => {
                let msg = req.session.msg;
                req.session.msg = undefined;
                if (articles.length >= 1) {
                    let latest = articles.shift();
                    let words = latest.edits[0].content.split(/(\w+)/).filter(e => e !== ' ');
                    let result = '';
                    let counter = 0;
                    for (let i = 0; i < words.length; i++) {
                        if (counter > 50) {
                            break;
                        }

                        counter++;
                        result += `${words[i]} `;
                    }
                    latest.edits[0].content = result;
                    res.render('home/index', { msg, latest, articles });
                } else {
                    res.render('home/index', { msg });
                }
            }).catch(() => {
                res.sendStatus(400);
            });
        } else {
            getArticles().then((articles) => {
                if (articles.length >= 1) {
                    let latest = articles.shift();
                    let words = latest.edits[0].content.split(/(\w+)/).filter(e => e !== ' ');
                    let result = '';
                    let counter = 0;
                    for (let i = 0; i < words.length; i++) {
                        if (counter > 50) {
                            break;
                        }

                        counter++;
                        result += `${words[i]} `;
                    }
                    latest.edits[0].content = result;
                    res.render('home/index', { latest, articles });
                } else {
                    res.render('home/index');
                }
            }).catch(() => {
                res.sendStatus(400);
            });
        }
    }
};

function getArticles() {
    return new Promise((resolve, reject) => {
        ARTICLE.find({}).sort({ creationDate: -1 }).limit(4)
            .populate({ path: 'edits', options: { sort: { 'creationDate': -1 } } }).then((articles) => {
                resolve(articles);
            }).catch((err) => {
                console.log(err);
                reject();
            });
    });
}