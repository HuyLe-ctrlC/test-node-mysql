const { validationResult } = require('express-validator');
const CowBreeds = require('../models/cowBreeds.model');
const constants = require('../config/constants');

const { ADD_DATA_SUCCESS, ADD_DATA_FAILED, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAILED, DELETE_DATA_SUCCESS } =
    constants.constantNotify;

// get all data
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
    CowBreeds.getAll(dataSearch, limit, offset, orderby, (err, data) => {
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
    CowBreeds.findById(id, (err, data) => {
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
        const product = new CowBreeds({
            code: req.body.code,
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            sort: 0,
            created_at: Date.now(),
        });
        //only update -> delete
        delete product.updated_at;
        CowBreeds.create(product, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            product.id = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: product,
                    },
                ],
            });
        });
    } catch (error) {
        res.send({
            result: false,
            errors: [{ msg: ADD_DATA_FAILED }],
        });
    }
};

//update data
exports.update = (req, res) => {
    // validate Req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ result: false, errors: [errors] });
    }
    try {
        const product = new CowBreeds({
            code: req.body.code,
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            sort: 0,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete product.created_at;
        CowBreeds.updateById(product, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            product.id = req.params.id;
            product.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: product,
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
        CowBreeds.updatePublishById(id, publish, (err, data) => {
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
        const sort = [req.body.sort];
        CowBreeds.updateSortById(id, sort, (err, data) => {
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
    CowBreeds.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
