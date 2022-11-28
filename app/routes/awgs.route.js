const awgsController = require('../controllers/awgs.controller');
const router = require('express').Router();
const { body } = require('express-validator');
module.exports = (app) => {
    // Retrieve all data
    router.get('/getall', awgsController.findAll);
    // Retrieve all data
    router.get('/getbyid/:id', awgsController.findById);
    // Create data
    router.post('/create', [body('name', 'The name not empty').notEmpty().trim()], awgsController.create);
    // Update data by ID
    router.put('/update/:id', [body('name', 'The name not empty').notEmpty().trim()], awgsController.update);
    router.put('/update-publish/:id', awgsController.updatePublish);
    //Update sort by id
    router.put('/update-sort/:id', awgsController.updateSort);
    // Delete a data with id
    router.delete('/delete/:id', awgsController.delete);
    app.use('/api/awgs', router);
};
