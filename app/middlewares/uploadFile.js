const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file.mimetype);
        // console.log(req);
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, 'app/uploads/image');
        } else {
            cb({ result: false, errors: [{ meg: 'not image' }] }, null);
        }
        // console.log(file, '123');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '.jpg');
        // console.log(file);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
