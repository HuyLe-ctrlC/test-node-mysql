const db = require('./connectDB');
const tableName = 'tbl_role';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Role = function (role) {
    this.name = role.name;
    this.publish = role.publish;
    this.created_at = role.created_at;
    this.updated_at = role.updated_at;
};

// select data all
Role.getAll = (dataSearch, limit, result) => {
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
        like = `WHERE name LIKE "%${keyword}%"`;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName} ${like}) as total FROM ${tableName} ${like} ORDER BY id ${orderBy} LIMIT ?,?`;
    }

    db.query(query, [offset, limit], (err, res) => {
        // console.log(q);
        console.log(err, res);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, res);
    });
};

// select data by ID
Role.findById = (id, result) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        // console.log("found todo: ", res[0]);
        result(null, res[0]);
    });
};

// insert db
Role.create = (newsData, result) => {
    db.query(`INSERT INTO ${tableName} SET ?`, newsData, function (err, res) {
        if (err) {
            // console.log('error', err);
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

// update data by ID
Role.updateById = (id, dataNew, result) => {
    db.query(
        `UPDATE ${tableName} SET name = ?, publish = ?, updated_at = ? WHERE id = ?`,
        [dataNew.name, dataNew.publish, dataNew.updated_at, id],
        (err, res) => {
            if (err) {
                // console.log(err);
                result({ msg: ERROR }, null);
                return;
            }
            if (res.affectedRows == 0) {
                // not found todo with the id
                result({ msg: `ID ${NOT_EXITS}` }, null);
                return;
            }
            result(null, res);
        },
    );
};

// update data by ID
Role.updatePublishById = (id, publish, result) => {
    db.query(`UPDATE ${tableName} SET publish = ? WHERE id = ?`, [publish, id], (err, res) => {
        if (err) {
            // console.log(err);
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found todo with the id
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        result(null, res);
    });
};

// remove data by ID
Role.remove = (id, result) => {
    db.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
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

module.exports = Role;
