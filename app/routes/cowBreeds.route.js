const router = require('express').Router();
const { body } = require('express-validator');
const cowBreedsController = require('../controllers/cowBreeds.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', cowBreedsController.findAll);
    //all data by id
    router.get('/getbyid/:id', cowBreedsController.findById);
    //insert data
    router.post(
        '/create',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        cowBreedsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        cowBreedsController.update,
    );
    //update publish
    router.put('/update-publish/:id', cowBreedsController.updatePublish);
    //
    router.put('/update-sort/:id', cowBreedsController.updateSort);
    //delelet data
    router.delete('/delete/:id', cowBreedsController.delete);

    app.use('/api/cow-breeds', router);
};
