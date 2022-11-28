const { validationResult } = require('express-validator');
const constants = require('../config/constants');
const Levels = require('../models/levels.model');

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
    Levels.getAll(dataSearch, limit, (err, data) => {
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
    Levels.findById(id, (err, data) => {
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
        const levels = new Levels({
            name: req.body.name,
            level_value: req.body.level_value,
            use_ale_min: req.body.use_ale_min,
            use_ale_max: req.body.use_ale_max,
            overdraft_payment_amout: req.body.overdraft_payment_amout,
            overdraft_payment_status: !req.body.overdraft_payment_status ? false : true,
            publish: !req.body.publish ? false : true,
            created_at: Date.now(),
        });

        //only update -> delete
        delete levels.updated_at;
        Levels.create(levels, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            levels.id = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: levels,
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
        const levels = new Levels({
            name: req.body.name,
            level_value: req.body.level_value,
            use_ale_min: req.body.use_ale_min,
            use_ale_max: req.body.use_ale_max,
            overdraft_payment_amout: req.body.overdraft_payment_amout,
            overdraft_payment_status: !req.body.overdraft_payment_status ? false : true,
            publish: !req.body.publish ? false : true,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete levels.created_at;
        Levels.updateById(levels, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            levels.id = req.params.id;
            levels.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: levels,
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
        Levels.updatePublishById(id, publish, (err, data) => {
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
    Levels.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
