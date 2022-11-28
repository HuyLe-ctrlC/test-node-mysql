const AdminsController = require('../controllers/admins.controller');
const router = require('express').Router();
const { body } = require('express-validator');

module.exports = (app) => {
    //get all data
    router.get('/getall', AdminsController.findAll);
    //get data by id
    router.get('/getbyid/:id', AdminsController.getByID);
    //insert data
    router.post(
        '/create',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('username', 'The username not empty').notEmpty().trim(),
            body('password', 'The password not empty').notEmpty().trim(),
        ],
        AdminsController.create,
    );
    // Update data by ID
    router.put(
        '/update/:id',
        [
            body('name', 'The name not empty').notEmpty().trim(),
            body('username', 'The username not empty').notEmpty().trim(),
        ],
        AdminsController.update,
    );
    router.put('/update-active/:id', AdminsController.updateActive);
    // Delete a data with id
    router.delete('/delete/:id', AdminsController.delete);
    router.post(
        '/login',
        [
            body('username', 'Invalid username').notEmpty().escape().trim(),
            body('password', 'Invalid username').notEmpty().trim(),
        ],
        AdminsController.login,
    );
    router.get('/refreshToken', AdminsController.refreshToken);
    router.put(
        '/changePassword/:id',
        [
            body('passwordCurrent', 'The name not empty').notEmpty().trim(),
            body('passwordNew', 'The username not empty').notEmpty().trim(),
        ],
        AdminsController.updatePassword,
    );

    app.use('/api/admins', router);
};
