const router = require('express').Router();
const { body } = require('express-validator');
const cowGroupsController = require('../controllers/cowGroups.controller');

module.exports = (app) => {
    //all data
    router.get('/getall', cowGroupsController.findAll);
    //all data by id
    router.get('/getbyid/:id', cowGroupsController.findById);
    //insert data
    router.post(
        '/create',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        cowGroupsController.create,
    );
    //update data
    router.put(
        '/update/:id',
        [body('code', 'The code not empty').notEmpty().trim(), body('name', 'The name not empty').notEmpty().trim()],
        cowGroupsController.update,
    );
    //update publish
    router.put('/update-publish/:id', cowGroupsController.updatePublish);
    //
    router.put('/update-sort/:id', cowGroupsController.updateSort);
    //delelet data
    router.delete('/delete/:id', cowGroupsController.delete);

    app.use('/api/cow-groups', router);
};
