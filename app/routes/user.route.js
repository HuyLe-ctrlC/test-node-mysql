const userController = require('../controllers/user.controller');
const router = require('express').Router();
const { body } = require('express-validator');
module.exports = (app) => {
    // Retrieve all data
    router.get('/getall', userController.findAll);

    // Retrieve all data
    router.get('/getbyid/:id', userController.findById);

    // Show form create data
    router.post(
        '/register',
        [
            body('fullname', 'The name must be of minimum 3 characters length')
                .notEmpty()
                .escape()
                .trim()
                .isLength({ min: 3 }),
            body('email', 'Invalid email address').notEmpty().escape().trim().isEmail(),
            body('password', 'The Password must be of minimum 6 characters length')
                .notEmpty()
                .trim()
                .isLength({ min: 6 }),
        ],
        userController.register,
    );
    router.put(
        '/update/:id',
        // [
        //     body('fullname', 'The name must be of minimum 3 characters length').notEmpty().escape().trim(),
        //     body('phone', 'Invalid phone not empty').notEmpty().escape().trim(),
        //     body('sex', 'Invalid sex not empty').notEmpty().escape().trim(),
        //     body('birthday', 'Invalid birthday not empty').notEmpty().escape().trim(),
        // ],
        userController.update,
    );
    // // Store Todo
    // router.post("/", todoController.store);

    // // Retrieve a single data with id
    // router.get("/edit/:id", todoController.edit);
    // // Update a data with id
    // router.put("/:id", todoController.update);

    // Delete a data with id
    router.delete('/delete/:id', userController.delete);

    // // Delete all data
    // router.delete("/delete", todoController.deleteAll);

    app.use('/api/user', router);
};
