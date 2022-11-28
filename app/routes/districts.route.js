const DistrictsController = require('../controllers/districts.controller');
const router = require('express').Router();
const { body } = require('express-validator');

module.exports = (app) => {
    //get all data
    router.get('/getall', DistrictsController.findAll);
    router.get('/getbyid/:id', DistrictsController.getByID);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('cityID', 'The cityID not empty').notEmpty().trim(),
        ],
        DistrictsController.create,
    );
    // Update data by ID
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('cityID', 'The cityID not empty').notEmpty().trim(),
        ],
        DistrictsController.update,
    );
    //update publish
    router.put('/update-publish/:id', DistrictsController.updatePublish);
    //Update sort by id
    router.put('/update-sort/:id', DistrictsController.updateSort);

    // search districts with city
    router.get('/getalls', DistrictsController.searchDictricts);
    // Delete a data with id
    router.delete('/delete/:id', DistrictsController.delete);

    app.use('/api/districts', router);
};
