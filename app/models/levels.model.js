const db = require('./connectDB');
const tableName = 'tbl_level';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Levels = function (levels) {
    this.id = levels.id;

    this.name = levels.name;
    this.level_value = levels.level_value;
    this.use_ale_min = levels.use_ale_min;
    this.use_ale_max = levels.use_ale_max;
    this.overdraft_payment_amout = levels.overdraft_payment_amout;
    this.overdraft_payment_status = levels.overdraft_payment_status;
    this.publish = levels.publish;
    this.created_at = levels.created_at;
    this.updated_at = levels.updated_at;
};

//select data all
Levels.getAll = (dataSearch, limit, result) => {
    let offset = 0;
    let orderBy = 'ASC';
    let keyword = '';
    let like = '';
    if (dataSearch.start) {
        offset = parseInt(dataSearch.start);
    }
    if (dataSearch.orderby) {
        orderBy = dataSearch.orderby;
    }
    let query = `SELECT *, (SELECT COUNT(*) FROM ${tableName}) as total FROM ${tableName} ORDER BY id ${orderBy} LIMIT ?,?`;
    if (dataSearch.keyword) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%" `;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName} ${like}) as total FROM ${tableName} ${like} ORDER BY id ${orderBy} LIMIT ?,?`;
    }

    db.query(query, [offset, limit], (err, res) => {
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
Levels.findById = (id, result) => {
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

//create data
Levels.create = (data, result) => {
    const q = `INSERT INTO ${tableName} SET ?`;

    db.query(q, [data], (err, res) => {
        // console.log(err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

//update data by id
Levels.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET name= ?,level_value = ?,use_ale_min = ?,use_ale_max = ?,overdraft_payment_amout = ?,overdraft_payment_status=?, publish = ?, updated_at = ? WHERE id = ?`;

    db.query(
        q,
        [
            data.name,
            data.level_value,
            data.use_ale_min,
            data.use_ale_max,
            data.overdraft_payment_amout,
            data.publish,
            data.overdraft_payment_status,
            data.updated_at,
            data.id,
        ],
        (err, res) => {
            // console.log(err);
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
        },
    );
};

//update publish by id
Levels.updatePublishById = (id, publish, result) => {
    const q = `UPDATE ${tableName} SET publish = ? WHERE id = ?`;

    db.query(q, [publish, id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows === 0) {
            //not found id
            result({ msg: `ID ${NOT_EXITS}` });
            return;
        }
        result(null, res);
    });
};

//delet data by id
Levels.remove = (id, result) => {
    const q = `DELETE FROM ${tableName} WHERE id =?`;

    db.query(q, [id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found data with the id
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Levels;
