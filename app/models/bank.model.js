const db = require('./connectDB');
const tableName = 'tbl_banks';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Bank = function (bank) {
    this.id = bank.id;
    this.name = bank.name;
    this.publish = bank.publish;
    this.sort = bank.sort;
    this.created_at = bank.created_at;
    this.updated_at = bank.updated_at;
};

//select data all
Bank.getAll = (dataSearch, limit, offset, orderby, result) => {
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
Bank.findById = (id, result) => {
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
Bank.create = (data, result) => {
    const q = `INSERT INTO ${tableName} SET ? `;

    db.query(q, [data], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

//update data by id
Bank.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET name= ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;
    db.query(q, [data.name, data.publish, data.sort, data.updated_at, data.id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows === 0) {
            //not found id
            result({ msg: `ID ${NOT_EXITS} ` });
            return;
        }
        result(null, res);
    });
};

//update publish by id
Bank.updatePublishById = (id, publish, result) => {
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
Bank.updateSortById = (id, sort, result) => {
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
Bank.remove = (id, result) => {
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
module.exports = Bank;
