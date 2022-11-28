const db = require('./connectDB');
const tableName = 'tbl_config';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Config = function (config) {
    this.id = config.id;
    this.type = config.type;
    this.content = config.content;
    this.created_at = config.created_at;
    this.updated_at = config.updated_at;
};

//select data all
Config.getAll = (dataSearch, result) => {
    let query = `SELECT * FROM ${tableName} `;
    if (dataSearch.keyword) {
        keyword = dataSearch.keyword;
        query = `SELECT * FROM ${tableName} WHERE type LIKE "%${keyword}%"`;
    }
    db.query(query, (err, res) => {
        console.log(err);
        // console.log(q);
        // console.log(err, res);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, res);
    });
};
//select data all by id
Config.findById = (id, result) => {
    const q = `SELECT * FROM ${tableName} WHERE id = ?`;
    db.query(q, [id], (err, res) => {
        if (res && res.length === 0) {
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        if (err) {
            result(
                {
                    msg: ERROR,
                },
                null,
            );
            return;
        }
        result(null, res[0]);
    });
};

//update data by id
Config.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET type= ?, content = ?, updated_at = ? WHERE id = ?`;

    db.query(q, [data.type, data.content, data.updated_at, data.id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows === 0) {
            //not found id
            result({ mess: `ID ${NOT_EXITS}` }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Config;
