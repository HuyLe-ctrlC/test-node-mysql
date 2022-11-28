const router = require('express').Router();
const { body } = require('express-validator');
const configController = require('../controllers/config.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', configController.findAll);
    //all data by id
    router.get('/getbyid/:id', configController.findById);
    //update data
    router.put(
        '/update/:id',
        [
            body('type', 'The key not empty').notEmpty().trim(),
            body('content', 'The content not empty').notEmpty().trim(),
        ],
        configController.update,
    );
    app.use('/api/config', router);
};
