const Districts = require('../models/districts.model');
const { validationResult } = require('express-validator');
const { query } = require('../models/connectDB');
const moment = require('moment');
// const date = moment(new Date()).format("YYYY-MM-DD");
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
    Districts.getAll(dataSearch, limit, offset, orderby, (err, data) => {
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
    Districts.getByID(req.params.id, (err, data) => {
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
    const { code, name, cityID, publish } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data insert
        const districts = new Districts({
            code: code,
            name: name,
            cityID: cityID,
            publish: !publish ? false : true,
            sort: 0,
            created_at: Date.now(),
        });
        delete districts.updated_at;

        Districts.create(districts, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                districts.id = data.id;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: ADD_DATA_SUCCESS,
                            insertId: data.id,
                            newData: districts,
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
    const { code, name, cityID, publish, updated_at } = req.body;
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ result: false, errors: errors.array() });
    }

    try {
        // data update
        const districts = new Districts({
            code: code,
            name: name,
            cityID: cityID,
            publish: publish,
            updated_at: Date.now(),
        });

        Districts.updateById(req.params.id, districts, (err, data) => {
            if (err) {
                // console.log('err: ', err);
                res.send({
                    result: false,
                    errors: [err],
                });
            } else {
                districts.id = req.params.id;
                districts.created_at = 0;
                res.send({
                    result: true,
                    data: [
                        {
                            msg: UPDATE_DATA_SUCCESS,
                            newData: districts,
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
        Districts.updatePublishById(req.params.id, publish, (err, data) => {
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
        Districts.updateSortById(req.params.id, sort, (err, data) => {
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
    Districts.remove(req.params.id, (err, data) => {
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

// search;
exports.searchDictricts = (req, res) => {
    const { cityID } = req.query;
    Districts.searchDictricts(cityID, (err, data) => {
        if (err) {
            res.send({ result: false, msg: err });
        } else res.send({ result: true, data: [{ cityID: cityID, districts: data }] });
    });
};
