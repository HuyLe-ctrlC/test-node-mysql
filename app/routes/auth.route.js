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
        authController.register,
    );
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
    router.post(
        '/forgot-password',
        [body('email', 'Invalid email address').notEmpty().escape().trim().isEmail()],
        authController.forgotPassword,
    );
    router.put(
        '/changePassword/:id',
        [
            body('passwordCurrent', 'The name not empty').notEmpty().trim(),
            body('passwordNew', 'The username not empty').notEmpty().trim(),
        ],
        authController.updatePassword,
    );

    router.get('/refreshToken', authController.refreshToken);

    app.use('/api/auth', router);
};
