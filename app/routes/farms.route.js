const router = require('express').Router();
const { body } = require('express-validator');
const farmsController = require('../controllers/farms.controller');

module.exports = (app) => {
    //all data
    router.get(
        '/getall',

        farmsController.findAll,
    );
    //all data by id
    router.get('/getbyid/:id', farmsController.findById);
    //insert data
    router.post(
        '/create',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('phone', 'The phone not empty').notEmpty().trim(),
            body('cityID', 'The cityID not empty').notEmpty().trim(),
            body('districtID', 'The districtID not empty').notEmpty().trim(),
            body('wardID', 'The wardID not empty').notEmpty().trim(),
            body('address', 'The address not empty').notEmpty().trim(),
        ],
        farmsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [
            body('code', 'The code not empty').notEmpty().trim(),
            body('name', 'The name not empty').notEmpty().trim(),
            body('phone', 'The phone not empty').notEmpty().trim(),
            body('cityID', 'The cityID not empty').notEmpty().trim(),
            body('districtID', 'The districtID not empty').notEmpty().trim(),
            body('wardID', 'The wardID not empty').notEmpty().trim(),
            body('address', 'The address not empty').notEmpty().trim(),
        ],
        farmsController.update,
    );
    //update publish
    router.put('/update-publish/:id', farmsController.updatePublish);
    //
    router.put('/update-sort/:id', farmsController.updateSort);
    //delelet data
    router.delete('/delete/:id', farmsController.delete);

    app.use('/api/farms', router);
};
