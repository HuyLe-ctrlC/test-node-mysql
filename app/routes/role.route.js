const roleController = require('../controllers/role.controller');
const router = require('express').Router();
const {body} = require('express-validator');
module.exports = app => {
    // Retrieve all data
    router.get('/getall', roleController.findAll);
    // Retrieve all data
    router.get('/getbyid/:id', roleController.findById);
    // Create data
    router.post(
        "/create", 
        [
            body('name',"The name not empty").notEmpty().trim(),
        ], 
        roleController.create
    );
    // Update data by ID
    router.put(
        "/update/:id", 
        [
            body('name',"The name not empty").notEmpty().trim(),
        ], 
        roleController.update
    );
    router.put("/update-publish/:id", roleController.updatePublish);
    // Delete a data with id
    router.delete("/delete/:id", roleController.delete);
    app.use('/api/role', router);
}