const router = require('express').Router();
const { body } = require('express-validator');
const localSalesController = require('../controllers/localSales.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', localSalesController.findAll);
    //all data by id
    router.get('/getbyid/:id', localSalesController.findById);
    //insert data
    router.post(
        '/create',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        localSalesController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        localSalesController.update,
    );
    //update publish
    router.put('/update-publish/:id', localSalesController.updatePublish);
    //
    router.put('/update-sort/:id', localSalesController.updateSort);
    //delelet data
    router.delete('/delete/:id', localSalesController.delete);

    app.use('/api/local-sales', router);
};
