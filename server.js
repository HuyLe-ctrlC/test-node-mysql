const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port_name = process.env.PORT;

// config non SSL
var http = require('http');
const server = http.createServer(app);

// config SSL
// var https = require('https');
// var fs = require('fs');
// const options = {
//     key: fs.readFileSync(`/www/server/panel/vhost/cert/app.agrios.optechdemo2.com/privkey.pem`),
//     cert: fs.readFileSync(`/www/server/panel/vhost/cert/app.agrios.optechdemo2.com/fullchain.pem`),
//     requestCert: false,
//     rejectUnauthorized: false
// };
// const server = https.createServer(options, app);

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const jwtMiddleware = require('./app/middlewares/jwt.middleware');
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //Cấp quyền cho client được truy cập để sử dụng tài nguyên, "*" là tất cả client.
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS, PATCH'); // Các phương thức của client khi gọi api
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //Content-Type: application/json định dạng kiểu dữ liệu json
    res.header('Access-Control-Allow-Credentials', true);
    next();
};
app.use(allowCrossDomain); // nhận biến allowCrossDomain ở trên
app.use(cors({ origin: true })); // origin: true cho phép client truy cập.
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }),
);

// routes list
require('./app/routes/admins.route')(app);
require('./app/routes/auth.route')(app);
// app.use(jwtMiddleware.isAuth); // check login
require('./app/routes/role.route')(app);
require('./app/routes/user.route')(app);
require('./app/routes/city.route')(app);
require('./app/routes/districts.route')(app);
require('./app/routes/wards.route')(app);
require('./app/routes/wallet.route')(app);
require('./app/routes/bank.route')(app);
require('./app/routes/productCates.route')(app);
require('./app/routes/localSales.route')(app);
require('./app/routes/cowGroups.route')(app);
require('./app/routes/cowBreeds.route')(app);
require('./app/routes/conditions.route')(app);
require('./app/routes/wges.route')(app);
require('./app/routes/awgs.route')(app);
require('./app/routes/products.route')(app);
require('./app/routes/farms.route')(app);
require('./app/routes/levels.route')(app);
require('./app/routes/class.route')(app);
require('./app/routes/weight.route')(app);
require('./app/routes/wgs.route')(app);
require('./app/routes/config.route')(app);
require('./app/routes/cowCPass.route')(app);

server.listen(port_name);
console.log('server listen port ' + port_name);
