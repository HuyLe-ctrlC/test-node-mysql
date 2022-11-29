const { validationResult } = require('express-validator');
const sharp = require('sharp');
const fs = require('fs');
const constants = require('../config/constants');
const CowCPass = require('../models/cowCPass.model');
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
    CowCPass.getAll(dataSearch, limit, (err, data) => {
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
    CowCPass.findById(id, (err, data) => {
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
    console.log(req.files);
    req?.files?.map((file) => {
        return sharp(file.path) //path file image
            .resize(200, 200)
            .toFile(`./uploads/image/thumb/${file.filename}`, function (err) {
                if (err) {
                    console.log(err);
                    res.send({ result: false, errors: [err] });
                    return;
                }
            });
    });
    console.log('ok okoko');
    try {
        console.log(req.body);
        //req from client
        const cPass = new CowCPass({
            name: req.body.name,
            card_number: req.body.card_number,
            cPass: req.body.cPass,
            date_added: req.body.date_added,
            cow_group: req.body.cow_group,
            cow_breek: req.body.cow_breek,
            farm: req.body.farm,
            gender: req.body.gender,
            birth_of_date: req.body.birth_of_date,
            pss: req.body.pss,
            age: req.body.age,
            pnow: req.body.pnow,
            conditions: req.body.conditions,
            weight_gain_effect: req.body.weight_gain_effect,
            avg_weight_gain: req.body.avg_weight_gain,
            sort: 0,
            created_at: Date.now(),
        });
        const nameImage = req.files.map((file) => file.filename);
        console.log(nameImage.length);
        for (let index = nameImage.length; index < 6; index++) {
            nameImage.push(null);
        }
        nameImage.push(Date.now());
        console.log(nameImage[2]);

        //only update -> delete
        delete cPass.updated_at;
        CowCPass.create(nameImage, cPass, (err, data) => {
            if (err) {
                res.send({
                    result: false,
                    errors: [err],
                });
                return;
            }
            cPass.id = data.id;
            res.send({
                result: true,
                data: [
                    {
                        msg: ADD_DATA_SUCCESS,
                        insertId: data.id,
                        newData: cPass,
                    },
                ],
            });
        });
    } catch (error) {
        console.log(error);
        res.send({
            result: false,
            errors: [{ mess: ADD_DATA_FAILED }],
        });
    }
    // });
};

//update data
exports.update = (req, res) => {
    // validate Req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ result: false, errors: [errors] });
    }
    sharp(req && req.file && req.file.path)
        .resize(200, 200)
        .toFile(`./uploads/image/thumb/${req.file.filename}`, function (err) {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
        });
    // console.log('successfully');
    try {
        const cPass = new CowCPass({
            name: req.body.name,
            card_number: req.body.card_number,
            cPass: req.body.cPass,
            date_added: req.body.date_added,
            cow_group: req.body.cow_group,
            cow_breek: req.body.cow_breek,
            farm: req.body.farm,
            gender: req.body.gender,
            birth_of_date: req.body.birth_of_date,
            pss: req.body.pss,
            age: req.body.age,
            pnow: req.body.pnow,
            conditions: req.body.conditions,
            weight_gain_effect: req.body.weight_gain_effect,
            avg_weight_gain: req.body.avg_weight_gain,
            sort: 0,
            updated_at: Date.now(),
            id: req.params.id,
        });
        const nameImage = req.files.map((file) => file.filename);
        console.log(nameImage.length);
        for (let index = nameImage.length; index < 6; index++) {
            nameImage.push(null);
        }
        nameImage.push(Date.now());
        console.log(nameImage[2]);

        //only create -> delete
        delete cPass.created_at;
        CowCPass.updateById(nameImage, cPass, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            cPass.id = req.params.id;
            cPass.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: cPass,
                    },
                ],
            });
        });
    } catch (error) {
        res.send({ result: false, errors: [{ msg: UPDATE_DATA_FAILED }] });
    }
    // });
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
        CowCPass.updatePublishById(id, publish, (err, data) => {
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
        CowCPass.updateSortById(id, sort, (err, data) => {
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
    CowCPass.remove(id, (err, data) => {
        if (err) {
            res.send({ result: false, errors: [err] });
            return;
        }
        res.send({ result: true, data: [{ msg: DELETE_DATA_SUCCESS }] });
    });
};
