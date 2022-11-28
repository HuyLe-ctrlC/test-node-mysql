const router = require('express').Router();
const { body } = require('express-validator');
const walletController = require('../controllers/wallet.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', walletController.findAll);
    //all data by id
    router.get('/getbyid/:id', walletController.findById);
    //insert data
    router.post('/create', [body('name', 'The name not empty').notEmpty().trim()], walletController.create);
    //update data
    router.put('/update/:id', [body('name', 'The name not empty').notEmpty().trim()], walletController.update);
    //update publish
    router.put('/update-publish/:id', walletController.updatePublish);
    //
    router.put('/update-sort/:id', walletController.updateSort);

    //delelet data
    router.delete('/delete/:id', walletController.delete);
    app.use('/api/wallet', router);
};
