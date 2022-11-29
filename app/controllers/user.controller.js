const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const constants = require('../config/constants');
const dbConfig = require('../config/db.config');
const db = require('../models/connectDB').promise();
const nodemailer = require('nodemailer');

const {
    ADD_DATA_SUCCESS,
    ADD_DATA_FAILED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,
    DELETE_DATA_SUCCESS,
    DEFAULT_LIMIT,
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
    User.getAll(dataSearch, limit, (err, data) => {
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

// Find a single Todo with a id
exports.findById = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            res.send({ result: false, data: err });
        } else res.send({ result: true, data: data ? data : null });
    });
};

exports.update = async (req, res) => {
    const { fullname, phone, gender, birthday, active } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }
    const [row] = await db.execute(`SELECT * FROM tbl_users WHERE  phone = ?`, [req.body.phone]);
    if (row.length !== 0) {
        return res.status(422).json({
            message: 'Số điện thoại đã tồn tại',
        });
    }

    try {
        // data update
        const user = new User({
            fullname: fullname,
            phone: phone,
            gender: gender,
            birthday: birthday,
            active: active,
            updated_at: Date.now(),
        });

        User.updateById(req.params.id, user, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                user.id = req.params.id;
                user.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: user,
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
    User.remove(req.params.id, (err) => {
        if (err) {
            res.send({ result: false, data: err });
        } else {
            res.send({
                result: true,
                msg: DELETE_DATA_SUCCESS,
            });
        }
    });
};
