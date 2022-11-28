const Wards = require('../models/wards.model');
const { validationResult } = require('express-validator');
const { query } = require('../models/connectDB');
const moment = require('moment');
const constants = require('../config/constants');
// const date = moment(new Date()).format("YYYY-MM-DD");

const {
    DEFAULT_LIMIT,
    ADD_DATA_SUCCESS,
    ADD_DATA_FAILED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,
    DELETE_DATA_SUCCESS,
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
    Wards.getAll(dataSearch, limit, (err, data) => {
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
    Wards.getByID(req.params.id, (err, data) => {
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
    const { code, name, districtID, publish } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data insert
        const wards = new Wards({
            code: code,
            name: name,
            districtID: districtID,
            publish: !publish ? false : true,
            sort: 0,
            created_at: Date.now(),
        });
        // delete updated_at element from districts
        delete wards.updated_at;

        Wards.create(wards, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                wards.id = data.id;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: ADD_DATA_SUCCESS,
                            insertId: data.id,
                            newData: wards,
                        },
                    ],
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
    const { code, name, districtID, publish, updated_at } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data update
        const wards = new Wards({
            code: code,
            name: name,
            districtID: districtID,
            publish: !publish ? false : true,
            updated_at: Date.now(),
        });

        Wards.updateById(req.params.id, wards, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                wards.id = req.params.id;
                wards.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: wards,
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

// Update publish field by ID
exports.updatePublish = (req, res) => {
    try {
        let publish = req.body.publish;
        Wards.updatePublishById(req.params.id, publish, (err, data) => {
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
// Update sort field by ID
exports.updateSort = (req, res) => {
    try {
        let sort = [req.body.sort];
        Wards.updateSortById(req.params.id, sort, (err, data) => {
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
    Wards.remove(req.params.id, (err, data) => {
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

//search
exports.searchWards = (req, res) => {
    const { districtID } = req.query;
    Wards.searchWards(districtID, (err, data) => {
        // console.log(data);
        if (err) {
            res.send({ result: false, msg: err });
        } else res.send({ result: true, data: [{ districtID: districtID, wards: data }] });
    });
};
