const { validationResult } = require('express-validator');
const constants = require('../config/constants');
const Config = require('../models/config.model');

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

    if (req.query) {
        dataSearch = req.query;
    }
    // console.log(dataSearch);
    Config.getAll(dataSearch, (err, data) => {
        if (err) {
            res.send({ result: false, msg: err });
        } else {
            res.send({ result: true, data: data.length > 0 ? data : null });
        }
    });
};

//get all data by id
exports.findById = (req, res) => {
    const id = req.params.id;
    Config.findById(id, (err, data) => {
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

//update data
exports.update = async (req, res) => {
    // validate Req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ result: false, errors });
    }
    console.log(req.body.content);
    try {
        const config = new Config({
            type: req.body.type,
            content: req.body.content,
            updated_at: Date.now(),
            id: req.params.id,
        });

        //only create -> delete
        delete config.created_at;
        Config.updateById(config, (err, data) => {
            if (err) {
                res.send({ result: false, errors: [err] });
                return;
            }
            config.id = req.params.id;
            config.created_at = 0;
            res.send({
                result: true,
                data: [
                    {
                        msg: UPDATE_DATA_SUCCESS,
                        newData: config,
                    },
                ],
            });
        });
    } catch (error) {
        res.send({ result: false, errors: [{ msg: UPDATE_DATA_FAILED }] });
    }
};
