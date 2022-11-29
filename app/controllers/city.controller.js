const City = require('../models/city.model');
const { validationResult } = require('express-validator');
const Districts = require('../models/districts.model');
const constants = require('../config/constants');

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
    // console.log(req.query);
    City.getAll(dataSearch, limit, offset, orderby, (err, data) => {
        if (err) {
            res.send({
                result: false,
                errors: err,
            });
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
    City.findById(req.params.id, (err, data) => {
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
        const city = new City({
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            created_at: Date.now(),
        });
        // delete updated_at element from city
        delete city.updated_at;
        // console.log(city);

        City.create(city, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                city.id = data.id;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: ADD_DATA_SUCCESS,
                            insertId: data.id,
                            newData: city,
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
        const city = new City({
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            updated_at: Date.now(),
        });

        City.updateById(req.params.id, city, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                city.id = req.params.id;
                city.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: city,
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
    City.remove(req.params.id, (err, data) => {
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
        City.updatePublishById(req.params.id, publish, (err, data) => {
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
