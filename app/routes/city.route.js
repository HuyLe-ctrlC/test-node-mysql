const cityController = require('../controllers/city.controller');
const router = require('express').Router();
const {body} = require('express-validator');
module.exports = app => {
    // Retrieve all data
    router.get('/getall', cityController.findAll);
    // Retrieve all data
    router.get('/getbyid/:id', cityController.findById);
    // Create data
    router.post(
        "/create", 
        [
            body('name',"The name not empty").notEmpty().trim(),
        ], 
        cityController.create
    );
    // Update data by ID
    router.put(
        "/update/:id", 
        [
            body('name',"The name not empty").notEmpty().trim(),
        ], 
        cityController.update
    );
    router.put("/update-publish/:id", cityController.updatePublish);
    // Delete a data with id
    router.delete("/delete/:id", cityController.delete);
    app.use('/api/city', router);
}