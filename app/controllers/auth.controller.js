const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models/connectDB').promise();
const jwt = require('../helper/auth.helper');
const jwts = require('jsonwebtoken');
// const { refreshToken } = require('./admins.controller');
const constants = require('../config/constants');

const { REFRESH_TOKEN, ACCESS_TOKEN } = constants.constantNotify;

// exports.register = async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }

//     try {
//         const [row] = await db.execute('SELECT `email` FROM `tbl_users` WHERE `email`=?', [req.body.email]);
//         console.log(row);

//         if (row.length > 0) {
//             return res.status(201).json({
//                 message: 'E-mail đã được sử dụng',
//             });
//         }

//         const hashPass = await bcrypt.hash(req.body.password, 12);

//         const [rows] = await db.execute('INSERT INTO `tbl_users` (`fullname`,`email`,`password`) VALUES(?,?,?)', [
//             req.body.fullname,
//             req.body.email,
//             hashPass,
//         ]);

//         if (rows.affectedRows === 1) {
//             return res.status(201).json({
//                 message: 'Đăng kí thành công',
//             });
//         }
//     } catch (err) {
//         next();
//     }
// };

exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const [row] = await db.execute('SELECT * FROM `tbl_users` WHERE `email`=?', [req.body.email]);

        if (row.length === 0) {
            return res.status(422).json({
                message: 'Email không đúng',
            });
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password);
        // console.log(passMatch)

        // console.log(req.body.password);
        // console.log(row[0].password);
        if (!passMatch) {
            return res.status(422).json({
                message: 'Password không đúng',
            });
        }

        // const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
        const _token = await jwt.make(row[0].id);
        const _refreshToken = await jwt.refreshToken(row[0].id);

        res.cookie('refreshTokenUser', _refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const [rows] = await db.execute('UPDATE `tbl_users` SET refreshToken = ? WHERE id = ?', [
            _refreshToken,
            row[0].id,
        ]);
        if (rows.length === 0) {
            return res.sendStatus(401);
        }

        return res.json({
            id: row[0].id,
            token: _token,
            refreshToken: _refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshTokenUser;
    if (!refreshToken) return res.sendStatus(401);
    try {
        const [row] = await db.execute('SELECT * FROM `tbl_users` WHERE `refreshToken` = ?', [refreshToken]);
        // console.log(row[0].refreshToken);
        if (row.length === 0) {
            return res.status(422).json({
                result: false,
                data: { msg: 'RefreshToken không hợp lệ' },
            });
        }
        // if (row[0].refreshToken == refreshToken) return res.sendStatus(403);
        // console.log('Token-DataBase:', row[0].refreshToken);
        // console.log('Token-Cookie:', refreshToken);
        // const _token = await jwt.make(row[0].id);
        // console.log('Token-Current:', _token);
        // res.json({ id: row[0].id, token: _token });

        jwts.verify(refreshToken, REFRESH_TOKEN, (err, data) => {
            if (err) return res.send(err);
            const userId = row[0].id;
            const accessToken = jwts.sign({ userId }, ACCESS_TOKEN, { expiresIn: '20s' });
            res.send({ accessToken });
        });
    } catch (error) {
        res.send({ result: false, errors: [error] });
    }
};
