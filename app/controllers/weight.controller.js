const { validationResult } = require('express-validator');
const constants = require('../config/constants');
const Weight = require('../models/weight.model');

const {
    DEFAULT_LIMIT,
    ADD_DATA_SUCCESS,
    ADD_DATA_FAILED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,
    DELETE_DATA_SUCCESS,
} = constants.constantNotify;

// get all data
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
    Weight.getAll(dataSearch, limit, (err, data) => {
        if (err) {
            res.send({ result: false, msg: err });
        } else {
            const totalPage = Math.ceil(data[0]?.total / limit);
            data?.forEach((item) => {
                delete item.total;
                // console.log(item);
            });
            res.send({ result: true, totalPage: totalPage, data: data.length > 0 ? data : null });
        }
    });
};

//get all data by id
exports.findById = (req, res) => {
    const id = req.params.id;
    Weight.findById(id, (err, data) => {
        if (err) {
            res.send({
                result: false,
                errors: [err],
            });
        } else {
            res.send({
                result: true,
                data: [data],
            });
        }
    });
};

//create data
exports.create = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ result: false, errors: errors.array() });
    }
    try {
        //req from client
        const weight = new Weight({
            name: req.body.name,
            min_value: req.body.min_value,
            max_value: req.body.max_value,
            publish: !req.body.publish ? false : true,
            sort: 0,
            created_at: Date.now(),
        });

        //only update -> delete
        delete weight.updated_at;
        Weight.create(weight, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            weight.id = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: weight,
                    },
                ],
            });
        });
    } catch (error) {
        res.send({
            result: false,
            errors: [{ mess: ADD_DATA_FAILED }],
        });
    }
};

//update data
exports.update = (req, res) => {
    // validate Req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ result: false, errors });
    }
    try {
        const weight = new Weight({
            name: req.body.name,
            min_value: req.body.min_value,
            max_value: req.body.max_value,
            publish: !req.body.publish ? false : true,
            sort: 0,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete weight.created_at;
        Weight.updateById(weight, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            weight.id = req.params.id;
            weight.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: weight,
                    },
                ],
            });
        });
    } catch (error) {
        res.send({ result: false, errors: [{ msg: UPDATE_DATA_FAILED }] });
    }
};

//update publish by id
exports.updatePublish = (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.json({ result: true, errors: [err] });
    }
    try {
        const id = req.params.id;
        const publish = [req.body.publish];
        Weight.updatePublishById(id, publish, (err, data) => {
            if (err) {
                // console.log(err);
                res.send({ result: false, errors: [err] });
                return;
            }
            res.send({ result: true, data: [{ msg: UPDATE_DATA_SUCCESS }] });
        });
    } catch (error) {
        res.send({ result: false, errors: [err] });
    }
};

//update sort by id
exports.updateSort = (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.json({ result: true, errors: [err] });
    }
    try {
        const id = req.params.id;
        const sort = req.params.id;
        Weight.updateSortById(id, sort, (err, data) => {
            if (err) {
                // console.log(err);
                res.send({ result: false, errors: [err] });
                return;
            }
            res.send({ result: true, data: [{ msg: UPDATE_DATA_SUCCESS }] });
        });
    } catch (error) {
        res.send({ result: false, errors: [err] });
    }
};

//delete data
exports.delete = (req, res) => {
    const id = req.params.id;
    Weight.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
