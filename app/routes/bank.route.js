const router = require('express').Router();
const { body } = require('express-validator');
const bankController = require('../controllers/bank.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', bankController.findAll);
    //all data by id
    router.get('/getbyid/:id', bankController.findById);
    //insert data
    router.post('/create', [body('name', 'The name not empty').notEmpty().trim()], bankController.create);
    //update data
    router.put('/update/:id', [body('name', 'The name not empty').notEmpty().trim()], bankController.update);
    //update publish
    router.put('/update-publish/:id', bankController.updatePublish);
    //update-sort
    router.put('/update-sort/:id', bankController.updateSort);

    //delelet data
    router.delete('/delete/:id', bankController.delete);
    app.use('/api/bank', router);
};
