const router = require('express').Router();
const { body } = require('express-validator');
const classController = require('../controllers/class.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', classController.findAll);
    //all data by id
    router.get('/getbyid/:id', classController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('balance_ale_min', 'The  balance_ale_min not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('balance_ale_max', 'The  balance_ale_max not empty').notEmpty().trim(),
            body('discount', 'The discount not empty').notEmpty().trim(),
        ],
        classController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('balance_ale_min', 'The  balance_ale_min not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('balance_ale_max', 'The  balance_ale_max not empty').notEmpty().trim(),
            body('discount', 'The discount not empty').notEmpty().trim(),
        ],
        classController.update,
    );
    //update publish
    router.put('/update-publish/:id', classController.updatePublish);
    //delelet data
    router.delete('/delete/:id', classController.delete);

    app.use('/api/class', router);
};
