const router = require('express').Router();
const { body } = require('express-validator');
const wgsController = require('../controllers/wgs.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', wgsController.findAll);
    //all data by id
    router.get('/getbyid/:id', wgsController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('cow_breeds_id', 'The cow_breeds_id not empty').notEmpty().trim(),
            body('weight_p0_id', 'The weight_p0_id not empty').notEmpty().trim(),
        ],
        wgsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('cow_breeds_id', 'The cow_breeds_id not empty').notEmpty().trim(),
            body('weight_p0_id', 'The weight_p0_id not empty').notEmpty().trim(),
        ],
        wgsController.update,
    );
    //update publish
    router.put('/update-publish/:id', wgsController.updatePublish);
    //
    router.put('/update-sort/:id', wgsController.updateSort);
    //delelet data
    router.delete('/delete/:id', wgsController.delete);

    app.use('/api/wgs', router);
};
