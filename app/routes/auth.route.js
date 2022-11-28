const authController = require('../controllers/auth.controller');
const router = require('express').Router();
const { body } = require('express-validator');
module.exports = (app) => {
    // register
    // router.post(
    //     '/register',
    //     // [
    //     //     body('fullname', 'The fullname must be of minimum 3 characters length').notEmpty().trim(),
    //     //     body('email', 'Invalid email address').notEmpty().escape().trim().isEmail(),
    //     //     body('password', 'The Password must be of minimum 4 characters length').notEmpty().trim(),
    //     // ],
    //     authController.register,
    // );

    // login
    router.post(
        '/login',
        [
            body('email', 'Invalid email address').notEmpty().escape().trim().isEmail(),
            body('password', 'The Password must be of minimum 4 characters length')
                .notEmpty()
                .trim()
                .isLength({ min: 4 }),
        ],
        authController.login,
    );

    router.get('/refreshToken', authController.refreshToken);

    app.use('/api/auth', router);
};
