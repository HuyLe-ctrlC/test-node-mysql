const Awgs = require('../models/awgs.model');
const { validationResult } = require('express-validator');
const constants = require('../config/constants');

const { ADD_DATA_SUCCESS, ADD_DATA_FAILED, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAILED, DELETE_DATA_SUCCESS } =
    constants.constantNotify;

exports.findAll = (req, res) => {
    let dataSearch = {};
    let limit = 15;
    let offset = 0;
    let orderby = 'asc';
    if (req.query) {
        dataSearch = req.query;
    }
    if (dataSearch.start) {
        offset = parseInt(dataSearch.start);
    }
    if (dataSearch.limit) {
        limit = parseInt(dataSearch.limit);
    }
    if (dataSearch.orderby) {
        orderby = dataSearch.orderby;
    }
    // console.log(dataSearch);
    Awgs.getAll(dataSearch, limit, offset, orderby, (err, data) => {
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
    Awgs.findById(req.params.id, (err, data) => {
        if (err) {
            res.send({
                result: false,
                errors: [err],
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
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data insert
        const awgs = new Awgs({
            code: req.body.code,
            name: req.body.name,
            min_value: req.body.min_value,
            max_value: req.body.max_value,
            publish: !req.body.publish ? false : true,
            sort: 0,
            created_at: Date.now(),
        });
        // delete updated_at element from awgs
        delete awgs.updated_at;
        // console.log(awgs);

        Awgs.create(awgs, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                awgs.id = data.id;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: ADD_DATA_SUCCESS,
                            insertId: data.id,
                            newData: awgs,
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
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data update
        const awgs = new Awgs({
            code: req.body.code,
            name: req.body.name,
            min_value: req.body.min_value,
            max_value: req.body.max_value,
            publish: !req.body.publish ? false : true,
            sort: 0,
            updated_at: Date.now(),
        });

        Awgs.updateById(req.params.id, awgs, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                awgs.id = req.params.id;
                awgs.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: awgs,
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
        let sort = [req.params.id];
        Awgs.updateSortById(req.params.id, sort, (err, data) => {
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
    Awgs.remove(req.params.id, (err, data) => {
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
// Update publish field by ID
exports.updatePublish = (req, res) => {
    try {
        let publish = req.body.publish;
        Awgs.updatePublishById(req.params.id, publish, (err, data) => {
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
