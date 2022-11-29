const { validationResult } = require('express-validator');
const Auth = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const db = require('../models/connectDB').promise();
const jwt = require('../helper/auth.helper');
const jwts = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const { refreshToken } = require('./admins.controller');
const constants = require('../config/constants');

const { REFRESH_TOKEN, ACCESS_TOKEN, ADD_DATA_SUCCESS } = constants.constantNotify;

exports.register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const [row] = await db.execute(`SELECT * FROM tbl_users WHERE email= ? OR phone = ?`, [
        req.body.email,
        req.body.phone,
    ]);
    if (row.length !== 0) {
        return res.status(422).json({
            message: 'Email hoặc Số điện thoại đã tồn tại',
        });
    }
    try {
        const hashPass = await bcrypt.hash(req.body.password, 12);
        // Create a data
        const user = new Auth({
            fullname: req.body.fullname,
            phone: req.body.phone,
            email: req.body.email,
            gender: req.body.gender,
            birthday: req.body.birthday,
            password: hashPass,
            active: req.body.active,
            created_at: Date.now(),
        });
        delete user.updated_at;
        Auth.register(user, (err, data) => {
            if (err) {
                res.send({ result: false, data: err });
            } else {
                user.id = data.id;
                res.send({
                    result: true,
                    msg: ADD_DATA_SUCCESS,
                    insertId: data.id,
                    newData: user,
                });
            }
        });
    } catch (error) {}
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const [row] = await db.execute('SELECT * FROM `tbl_users` WHERE `email`=?', [req.body.email]);

        if (row.length === 0) {
            return res.status(422).json({
                message: 'Email không tồn tại',
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
            const accessToken = jwts.sign({ userId }, ACCESS_TOKEN, { expiresIn: '1d' });
            res.send({ accessToken });
        });
    } catch (error) {
        res.send({ result: false, errors: [error] });
    }
};
exports.forgotPassword = async (req, res) => {
    // const email = req.body.email;
    const [checkEmail] = await db.execute(`SELECT * FROM tbl_users WHERE email= ? `, [req.body.email]);
    if (checkEmail.length === 0) {
        return res.status(422).json({
            result: false,
            msg: 'Email không tồn tại',
        });
    }
    const id = checkEmail[0].id;
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'phunobi1807@gmail.com',
                pass: 'njreccjobvgbmzdc',
            },
        });
        await transporter.sendMail({
            from: 'phunobi1807@gmail.com',
            to: `${req.body.email}`,
            subject: 'Vui lòng nhấn vào link để đổi mật khẩu',
            text: `Mật khẩu cũ của bạn là ${checkEmail[0].password} \nVui lòng ấn vào link http://localhost:3000/api/auth/changePassword/${id} để đổi mật khẩu`,
        });
        res.send({ result: true, id: id, msg: 'Vui lòng vào email để lấy lại mật khẩu !' });
    } catch (error) {
        res.send({ msg: 'Error' });
    }
};
exports.updatePassword = async (req, res) => {
    const { passwordCurrent, passwordNew } = req.body;
    // console.log(passwordCurrent, passwordNew);
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }
    // const hassPass = await bcrypt.hash(passwordNew, 12);
    try {
        // password update
        const user = new Auth({
            password: passwordCurrent,
            updated_at: Date.now(),
        });
        // console.log(admins);

        Auth.updatePasswordById(req.params.id, passwordNew, user, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                res.send({
                    result: true,
                    data: [
                        {
                            msg: 'Đổi mật khẩu thành công',
                        },
                    ],
                });
            }
        });
    } catch (error) {
        // console.log('err: ', error);
        res.send({
            result: false,
            errors: [
                {
                    msg: 'Đổi mật khẩu thất bại',
                },
            ],
        });
    }
};
