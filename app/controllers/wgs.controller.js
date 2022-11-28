const { validationResult } = require('express-validator');
const constants = require('../config/constants');
const Wgs = require('../models/wgs.model');
const db = require('../models/connectDB').promise();

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
    Wgs.getAll(dataSearch, limit, (err, data) => {
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
    Wgs.findById(id, (err, data) => {
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
    const [checkExistCowId] = await db.execute('SELECT id FROM `tbl_cow_breeds` WHERE `id`=?', [
        req.body.cow_breeds_id,
    ]);
    const [checkExistWeightID] = await db.execute('SELECT id FROM `tbl_weight_p0` WHERE `id`=?', [
        req.body.weight_p0_id,
    ]);

    if (checkExistCowId.length === 0 || checkExistWeightID.length === 0) {
        return res.status(422).json({
            result: false,
            data: { msg: 'cow_breeds_id hoặc weight_p0_id không tồn tại' },
        });
    }

    try {
        //req from client
        const wgs = new Wgs({
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            cow_breeds_id: req.body.cow_breeds_id,
            weight_p0_id: req.body.weight_p0_id,
            sort: 0,
            created_at: Date.now(),
        });

        //only update -> delete
        delete wgs.updated_at;
        Wgs.create(wgs, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            wgs.id = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: wgs,
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
exports.update = async (req, res) => {
    // validate Req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ result: false, errors });
    }

    const [checkExistCowId] = await db.execute('SELECT id FROM `tbl_cow_breeds` WHERE `id`=?', [
        req.body.cow_breeds_id,
    ]);
    const [checkExistWeightID] = await db.execute('SELECT id FROM `tbl_weight_p0` WHERE `id`=?', [
        req.body.weight_p0_id,
    ]);

    if (checkExistCowId.length === 0 || checkExistWeightID.length === 0) {
        return res.status(422).json({
            result: false,
            data: { msg: 'cow_breeds_id hoặc weight_p0_id không tồn tại' },
        });
    }
    try {
        const wgs = new Wgs({
            name: req.body.name,
            publish: !req.body.publish ? false : true,
            cow_breeds_id: req.body.cow_breeds_id,
            weight_p0_id: req.body.weight_p0_id,
            sort: 0,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete wgs.created_at;
        Wgs.updateById(wgs, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            wgs.id = req.params.id;
            wgs.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: wgs,
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
        Wgs.updatePublishById(id, publish, (err, data) => {
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
        const sort = [req.params.id];
        Wgs.updateSortById(id, sort, (err, data) => {
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
    Wgs.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
