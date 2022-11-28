const WardsController = require('../controllers/wards.controller');
const router = require('express').Router();
const { body } = require('express-validator');

module.exports = (app) => {
    //get all data
    router.get('/getall', WardsController.findAll);
    // search wards with districts
    router.get('/getalls', WardsController.searchWards);
    //get data by id
    router.get('/getbyid/:id', WardsController.getByID);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('districtID', 'The districtID not empty').notEmpty().trim(),
        ],
        WardsController.create,
    );
    // Update data by ID
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('districtID', 'The districtID not empty').notEmpty().trim(),
        ],
        WardsController.update,
    );
    router.put('/update-publish/:id', WardsController.updatePublish);
    //Update sort by id
    router.put('/update-sort/:id', WardsController.updateSort);
    // Delete a data with id
    router.delete('/delete/:id', WardsController.delete);

    app.use('/api/wards', router);
};
