const router = require('express').Router();
const { body } = require('express-validator');
const levelsController = require('../controllers/levels.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', levelsController.findAll);
    //all data by id
    router.get('/getbyid/:id', levelsController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('level_value', 'The  level_value not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('use_ale_min', 'The  use_ale_min not empty').notEmpty().trim(),
            body('use_ale_max', 'The use_ale_max not empty').notEmpty().trim(),
            body('overdraft_payment_amout', 'The overdraft_payment_amout not empty').notEmpty().trim(),
        ],
        levelsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('level_value', 'The  level_value not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('use_ale_min', 'The  use_ale_min not empty').notEmpty().trim(),
            body('use_ale_max', 'The use_ale_max not empty').notEmpty().trim(),
            body('overdraft_payment_amout', 'The overdraft_payment_amout not empty').notEmpty().trim(),
        ],
        levelsController.update,
    );
    //update publish
    router.put('/update-publish/:id', levelsController.updatePublish);
    //delelet data
    router.delete('/delete/:id', levelsController.delete);

    app.use('/api/levels', router);
};
