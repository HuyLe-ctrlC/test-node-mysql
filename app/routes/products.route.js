const router = require('express').Router();
const { body } = require('express-validator');
const productsController = require('../controllers/products.controller');
const upload = require('../middlewares/uploadFile');

module.exports = (app) => {
    //all data
    router.get('/getall', productsController.findAll);
    //all data by id
    router.get('/getbyid/:id', productsController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('image', 'The image not empty').notEmpty().trim(),
            body('price', 'The price not empty').notEmpty().trim(),
        ],
        upload.single('image'),
        productsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('image', 'The image not empty').notEmpty().trim(),
            body('price', 'The price not empty').notEmpty().trim(),
        ],
        upload.single('image'),
        productsController.update,
    );
    //update publish
    router.put('/update-publish/:id', productsController.updatePublish);
    //
    router.put('/update-sort/:id', productsController.updateSort);
    //delelet data
    router.delete('/delete/:id', productsController.delete);

    app.use('/api/products', router);
};
