const db = require('./connectDB');
const tableName = 'tbl_weight_p0';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Weight = function (weight) {
    this.id = weight.id;
    this.name = weight.name;
    this.min_value = weight.min_value;
    this.max_value = weight.max_value;
    this.publish = weight.publish;
    this.sort = weight.sort;
    this.created_at = weight.created_at;
    this.updated_at = weight.updated_at;
};

//select data all
Weight.getAll = (dataSearch, limit, result) => {
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
    let query = `SELECT *, (SELECT COUNT(*) FROM ${tableName}) as total FROM ${tableName} ORDER BY id ${orderBy}`;
    if (limit) {
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName}) as total FROM ${tableName} ORDER BY id ${orderBy} LIMIT ?,?`;
    }
    if (dataSearch.keyword) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%"`;
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
Weight.findById = (id, result) => {
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
Weight.create = (data, result) => {
    const q = `INSERT INTO ${tableName} SET ?`;
    db.query(q, [data], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

//update data by id
Weight.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET name= ?,min_value = ?,max_value = ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;

    db.query(
        q,
        [data.name, data.min_value, data.max_value, data.publish, data.sort, data.updated_at, data.id],
        (err, res) => {
            console.log(err);
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
Weight.updatePublishById = (id, publish, result) => {
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

//update sort by id
Weight.updateSortById = (id, sort, result) => {
    const q = `UPDATE ${tableName} SET sort = ? WHERE id = ?`;

    db.query(q, [sort, id], (err, res) => {
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
Weight.remove = (id, result) => {
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

module.exports = Weight;
