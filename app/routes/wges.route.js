const router = require('express').Router();
const { body } = require('express-validator');
const wgesController = require('../controllers/wges.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', wgesController.findAll);
    //all data by id
    router.get('/getbyid/:id', wgesController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('min_value', 'The min_value not empty').notEmpty().trim(),
            body('max_value', 'The max_value not empty').notEmpty().trim(),
        ],
        wgesController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('min_value', 'The min_value not empty').notEmpty().trim(),
            body('max_value', 'The max_value not empty').notEmpty().trim(),
        ],
        wgesController.update,
    );
    //update publish
    router.put('/update-publish/:id', wgesController.updatePublish);
    //
    router.put('/update-sort/:id', wgesController.updateSort);
    //delelet data
    router.delete('/delete/:id', wgesController.delete);

    app.use('/api/wges', router);
};
