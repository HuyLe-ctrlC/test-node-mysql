const router = require('express').Router();
const { body } = require('express-validator');
const productCatesController = require('../controllers/productCates.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', productCatesController.findAll);
    //all data by id
    router.get('/getbyid/:id', productCatesController.findById);
    //insert data
    router.post(
        '/create',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        productCatesController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        productCatesController.update,
    );
    //update publish
    router.put('/update-publish/:id', productCatesController.updatePublish);
    //
    router.put('/update-sort/:id', productCatesController.updateSort);
    //delelet data
    router.delete('/delete/:id', productCatesController.delete);

    app.use('/api/product-cates', router);
};
