const HOME_CONTROLLER = require('../controllers/home');
const PRODUCT_CONTROLLER = require('../controllers/product');
const CATEGORY_CONTROLLER = require('../controllers/category');
const MULTER = require('multer');

let upload = MULTER({ dest: './content/images' });

module.exports = (APP) => {
    APP.get('/', HOME_CONTROLLER.index);

    APP.get('/product/add', PRODUCT_CONTROLLER.addProductGet);
    APP.post('/product/add', upload.single('image'), PRODUCT_CONTROLLER.addProductPost);

    APP.get('/product/edit/:id', PRODUCT_CONTROLLER.editProductGet);
    APP.post('/product/edit/:id', upload.single('image'), PRODUCT_CONTROLLER.editProductPost);

    APP.get('/product/delete/:id', PRODUCT_CONTROLLER.deleteProductGet);
    APP.post('/product/delete/:id', PRODUCT_CONTROLLER.deleteProductPost);

    APP.get('/product/buy/:id', PRODUCT_CONTROLLER.buyProductGet);

    APP.get('/category/add', CATEGORY_CONTROLLER.addCategoryGet);
    APP.post('/category/add', CATEGORY_CONTROLLER.addCategoryPost);
    APP.get('/category/:category/products', CATEGORY_CONTROLLER.productsByCategory);
};