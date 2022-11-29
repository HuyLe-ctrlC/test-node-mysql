const { validationResult } = require('express-validator');
const Class = require('../models/class.model');
const constants = require('../config/constants');

const {
    ADD_DATA_SUCCESS,
    ADD_DATA_FAILED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILED,
    DELETE_DATA_SUCCESS,
    OBTAIN,
    NOT_OBTAIN,
} = constants.constantNotify;

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
    Class.getAll(dataSearch, limit, offset, orderby, (err, data) => {
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

//get all data by id
exports.findById = (req, res) => {
    const id = req.params.id;
    Class.findById(id, (err, data) => {
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
    let status;
    switch (req.body.sale_status) {
        case OBTAIN:
            status = 1;
            break;
        case NOT_OBTAIN:
            status = 0;
            break;

        default:
            break;
    }
    try {
        //req from client
        const classs = new Class({
            name: req.body.name,
            balance_ale_min: req.body.balance_ale_min,
            balance_ale_max: req.body.balance_ale_max,
            discount: req.body.discount,
            sale_status: status,
            publish: !req.body.publish ? false : true,
            created_at: Date.now(),
        });

        //only update -> delete
        delete classs.updated_at;
        Class.create(classs, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            classs.city = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: classs,
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
        return res.json({ result: false, errors });
    }
    console.log(req.body.sale_status);
    let status;
    switch (req.body.sale_status) {
        case OBTAIN:
            status = 1;
            break;
        case NOT_OBTAIN:
            status = 0;
            break;

        default:
            break;
    }
    try {
        const classs = new Class({
            name: req.body.name,
            balance_ale_min: req.body.balance_ale_min,
            balance_ale_max: req.body.balance_ale_max,
            discount: req.body.discount,
            sale_status: status,
            publish: !req.body.publish ? false : true,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete classs.created_at;
        Class.updateById(classs, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            classs.id = req.params.id;
            classs.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: classs,
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
        Class.updatePublishById(id, publish, (err, data) => {
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
    Class.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
