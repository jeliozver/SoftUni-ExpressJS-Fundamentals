const PATH = require('path');
const DB = require('../config/database.config');
const HANDLE_RESPONSE = require('../config/handleResponse');

module.exports = (req, res) => {
    let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/results.html'));

    if (req.pathname === '/search' && req.method === 'GET') {
        let params = getSearchParams(req.query);
        if (Object.keys(params).length === 0) {
            DB.mongo.getAllImages().then((images) => {
                let content = getTemplate(images);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                HANDLE_RESPONSE(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        } else if (params.hasOwnProperty('tags')) {
            params.limit = params.limit || 10;
            DB.mongo.searchByTagNameAndDate(params).then((imagesFound) => {
                let content = getTemplate(imagesFound);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                HANDLE_RESPONSE(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        } else {
            params.limit = params.limit || 10;
            DB.mongo.searchByDate(params).then((imagesFound) => {
                let content = getTemplate(imagesFound);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                HANDLE_RESPONSE(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        }
    } else {
        return true;
    }
};

function getSearchParams(query) {
    let result = {};

    if (query.tagName !== '') {
        result.tags = query.tagName.split(/\s*,\s*/).filter(onlyUnique);
    }

    if (query.afterDate !== '') {
        result.after = query.afterDate;
    }

    if (query.beforeDate !== '') {
        result.before = query.beforeDate;
    }

    if (query.limit !== '') {
        result.limit = Number(query.limit);
    }

    return result;
}

function getTemplate(images) {
    let result = '';
    for (let img of images) {
        result += `<div class="image">
       <h2>${img.title}</h2>
       <img src="${img.url}"></img>
       <p>${img.description}</p>
       <button onclick='location.href="/delete?id=${img._id}"'class='deleteBtn'>Delete</button> 
       </div>`;
    }

    return result;
}

function onlyUnique(value, index, self) {
    if (value === '') {
        return false;
    }

    return self.indexOf(value) === index;
}