const FS = require('fs');
const PATH = require('path');
const DB_PATH = PATH.join(__dirname, '/database.json');

function getProducts() {
    if (FS.existsSync(DB_PATH) === false) {
        FS.writeFileSync(DB_PATH, '[]');
        return [];
    }

    let json = FS.readFileSync(DB_PATH).toString() || '[]';
    return JSON.parse(json);
}

function saveProducts(products) {
    let json = JSON.stringify(products);
    FS.writeFileSync(DB_PATH, json);
}

module.exports.products = {};

module.exports.products.getAll = getProducts;

module.exports.products.add = (product) => {
    let products = getProducts();
    product.id = products.length + 1;
    products.push(product);
    saveProducts(products);
};

module.exports.products.findByName = (name) => {
    let products = getProducts();
    for (let product of products) {
        if (product.name === name) {
            return product;
        }
    }

    return null;
};

module.exports.products.filterByQuery = (query) => {
    let result = [];
    let products = getProducts();

    for (let product of products) {
        if (product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            result.push(product);
        }
    }

    return result;
};