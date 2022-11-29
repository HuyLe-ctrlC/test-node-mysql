const db = require('./connectDB');
const tableName = 'tbl_class';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Class = function (classs) {
    this.id = classs.id;
    this.name = classs.name;
    this.balance_ale_min = classs.balance_ale_min;
    this.balance_ale_max = classs.balance_ale_max;
    this.discount = classs.discount;
    this.sale_status = classs.sale_status;
    this.publish = classs.publish;
    this.created_at = classs.created_at;
    this.updated_at = classs.updated_at;
};

//select data all
Class.getAll = (dataSearch, limit, offset, orderby, result) => {
    let query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby}`;
    if (limit) {
        query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby} LIMIT ?,?`;
    }
    if (dataSearch.keyword && limit) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE  name LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE name LIKE "%${keyword}%" ORDER BY id ${orderby} LIMIT ?,?`;
    }
    if (dataSearch.keyword && !limit) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE  name LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE name LIKE "%${keyword}%" ORDER BY id ${orderby}`;
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
Class.findById = (id, result) => {
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
Class.create = (data, result) => {
    const q = `INSERT INTO ${tableName} SET ?`;

    db.query(q, [data], (err, res) => {
        console.log(err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

//update data by id
Class.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET name= ?,balance_ale_min = ?,balance_ale_max = ?,discount = ?,sale_status = ?, publish = ?, updated_at = ? WHERE id = ?`;

    db.query(
        q,
        [
            data.name,
            data.balance_ale_min,
            data.balance_ale_max,
            data.discount,
            data.sale_status,
            data.publish,
            data.updated_at,
            data.id,
        ],
        (err, res) => {
            console.log(err);
            if (err) {
                result({ msg: ERROR }, null);
                return;
            }
            if (res.affectedRows === 0) {
                //not found id
                result({ msg: `ID ${NOT_EXITS}` }, null);
                return;
            }
            result(null, res);
        },
    );
};

//update publish by id
Class.updatePublishById = (id, publish, result) => {
    const q = `UPDATE ${tableName} SET publish = ? WHERE id = ?`;

    db.query(q, [publish, id], (err, res) => {
        // console.log(err);
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
Class.remove = (id, result) => {
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

module.exports = Class;
