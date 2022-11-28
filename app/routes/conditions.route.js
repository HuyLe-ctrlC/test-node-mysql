const router = require('express').Router();
const { body } = require('express-validator');
const conditionsController = require('../controllers/condition.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', conditionsController.findAll);
    //all data by id
    router.get('/getbyid/:id', conditionsController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('color_text', 'The color_text not empty').notEmpty().trim(),
            body('color_bg', 'The color_bg not empty').notEmpty().trim(),
        ],
        conditionsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('color_text', 'The color_text not empty').notEmpty().trim(),
            body('color_bg', 'The color_bg not empty').notEmpty().trim(),
        ],
        conditionsController.update,
    );
    //update publish
    router.put('/update-publish/:id', conditionsController.updatePublish);
    //
    router.put('/update-sort/:id', conditionsController.updateSort);
    //delelet data
    router.delete('/delete/:id', conditionsController.delete);

    app.use('/api/conditions', router);
};
