const router = require('express').Router();
const { body } = require('express-validator');
const cowCPassController = require('../controllers/cowCPass.controller');
const upload = require('../middlewares/uploadFile');

module.exports = (app) => {
    //all data
    router.get('/getall', cowCPassController.findAll);
    //all data by id
    router.get('/getbyid/:id', cowCPassController.findById);
    //insert data
    router.post('/create', upload.array('image', 6), cowCPassController.create);
    //update data
    router.put('/update/:id', upload.array('image', 6), cowCPassController.update);
    //update publish
    router.put('/update-publish/:id', cowCPassController.updatePublish);
    //
    router.put('/update-sort/:id', cowCPassController.updateSort);
    //delelet data
    router.delete('/delete/:id', cowCPassController.delete);

    app.use('/api/cow-cpass', router);
};
