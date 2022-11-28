const router = require('express').Router();
const { body } = require('express-validator');
const weightController = require('../controllers/weight.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', weightController.findAll);
    //all data by id
    router.get('/getbyid/:id', weightController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('min_value', 'The min_value not empty').notEmpty().trim(),
            body('max_value', 'The max_value not empty').notEmpty().trim(),
        ],
        weightController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('min_value', 'The min_value not empty').notEmpty().trim(),
            body('max_value', 'The max_value not empty').notEmpty().trim(),
        ],
        weightController.update,
    );
    //update publish
    router.put('/update-publish/:id', weightController.updatePublish);
    //
    router.put('/update-sort/:id', weightController.updateSort);
    //delelet data
    router.delete('/delete/:id', weightController.delete);

    app.use('/api/weight', router);
};
