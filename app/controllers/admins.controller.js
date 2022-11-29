const Admins = require('../models/admins.model');
const { validationResult } = require('express-validator');
// const { query } = require("../models/connectDB");
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('../helper/auth.helper');
const jwts = require('jsonwebtoken');
const constants = require('../config/constants');
const db = require('../models/connectDB').promise();

// const date = moment(new Date()).format('YYYY-MM-DD');
const {
    ADD_DATA_SUCCESS,
    ADD_DATA_FAILED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,
    DELETE_DATA_SUCCESS,
    DEFAULT_LIMIT,
    REFRESH_TOKEN,
    ACCESS_TOKEN,
} = constants.constantNotify;
exports.findAll = (req, res) => {
    let dataSearch = {};

    let limit = DEFAULT_LIMIT;
    if (req.query) {
        dataSearch = req.query;
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    // console.log(dataSearch);
    Admins.getAll(dataSearch, limit, (err, data) => {
        if (err) {
            res.send({ result: false, msg: err });
        } else {
            const totalPage = Math.ceil(data[0]?.total / limit);
            data?.forEach((item) => {
                delete item.total;
            });
            res.send({ result: true, totalPage: totalPage, data: data.length > 0 ? data : null });
        }
    });
};

exports.getByID = (req, res) => {
    Admins.getByID(req.params.id, (err, data) => {
        if (err) {
            res.send({
                result: false,
                errors: err,
            });
        } else {
            res.send({
                result: true,
                data: data ? data : null,
            });
        }
    });
};

// insert data
exports.create = async (req, res) => {
    const { name, username, active } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        //hash password
        const hashPass = await bcrypt.hash(req.body.password, 12);
        // data insert
        const admins = new Admins({
            name: name,
            username: username,
            password: hashPass,
            refreshToken: 0,
            active: !active ? false : true,
            created_at: Date.now(),
        });
        // delete updated_at element from admins
        delete admins.updated_at;
        // console.log(admins);

        Admins.create(admins, (err, data) => {
            if (err) {
                res.send({ result: false, errors: err });
            } else {
                admins.id = data.id;
                admins.updated_at = 0;
                res.send({
                    result: true,
                    data: {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: admins,
                    },
                });
            }
        });
    } catch (error) {
        res.send({
            result: false,
            errors: [
                {
                    msg: ADD_DATA_FAILED,
                },
            ],
        });
    }
};

// Update data by ID
exports.update = (req, res) => {
    const { name, username, active } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data update
        const admins = new Admins({
            name: name,
            username: username,
            active: !active ? false : true,
            updated_at: Date.now(),
        });

        Admins.updateById(req.params.id, admins, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                admins.id = req.params.id;
                admins.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: admins,
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
                    msg: UPDATE_DATA_FAILED,
                },
            ],
        });
    }
};
exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        const [row] = await db.execute('SELECT * FROM `tbl_admins` WHERE `username`=?', [req.body.username]);

        if (row.length === 0) {
            return res.status(422).json({
                result: false,
                data: { msg: 'Username không đúng' },
            });
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password);

        // console.log(passMatch);

        // console.log(typeof req.body.password);
        // console.log(row[0].password);
        // console.log(row[0]);

        if (!passMatch) {
            return res.status(422).json({
                result: false,
                data: { msg: 'Password không đúng' },
            });
        }

        // const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
        const _token = await jwt.make(row[0].id);
        const _refreshToken = await jwt.refreshToken(row[0].id);

        res.cookie('refreshTokenAdmin', _refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        Admins.updateRefreshToken(row[0].id, _refreshToken);
        return res.json({
            id: row[0].id,
            token: _token,
            refreshToken: _refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

//refreshToken
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshTokenAdmin;
    if (!refreshToken) return res.sendStatus(401);
    try {
        const [row] = await db.execute('SELECT * FROM `tbl_admins` WHERE `refreshToken` = ?', [refreshToken]);
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
// Update password by ID

// Update active field by ID
exports.updateActive = (req, res) => {
    try {
        console.log(req.body.active);
        let active = !req.body.active ? false : true;
        console.log(active);
        Admins.updateActiveById(req.params.id, active, (err, data) => {
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
                            msg: UPDATE_DATA_SUCCESS,
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
                    msg: UPDATE_DATA_FAILED,
                },
            ],
        });
    }
};

// delete data by ID
exports.delete = (req, res) => {
    Admins.remove(req.params.id, (err, data) => {
        if (err) {
            res.send({
                result: false,
                errors: [err],
            });
        } else {
            res.send({
                result: true,
                data: [
                    {
                        msg: DELETE_DATA_SUCCESS,
                    },
                ],
            });
        }
    });
};
