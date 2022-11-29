const db = require('./connectDB');
const tableName = 'tbl_admins';
const bcrypt = require('bcryptjs');
const constants = require('../config/constants');
const Admins = function (admins) {
    this.name = admins.name;
    this.username = admins.username;
    this.password = admins.password;
    this.refreshToken = admins.refreshToken;
    this.active = admins.active;
    this.created_at = admins.created_at;
    this.updated_at = admins.updated_at;
};

const { ERROR, ALREADY_EXITS, NOT_EXITS, DEFAULT_LIMIT } = constants.constantNotify;

//select all admins
Admins.getAll = (dataSearch, limit, result) => {
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
    if (dataSearch.keyword && limit) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%" OR username LIKE "%${keyword}%" `;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName} ${like}) as total FROM ${tableName} ${like} ORDER BY id ${orderBy} LIMIT ?,?`;
    }

    if (dataSearch.keyword && !limit) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%" OR username LIKE "%${keyword}%" `;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName} ${like}) as total FROM ${tableName} ${like} ORDER BY id ${orderBy}`;
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
//select admins by id
Admins.getByID = (id, result) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        //console.log("id: ", res[0]);
        result(null, res[0]);
    });
};
// insert db
Admins.create = (newsData, result) => {
    const q = `SELECT username FROM ${tableName}`;
    db.query(q, (err, res) => {
        // console.log('error', err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const usernameDb = res.map((value, i) => {
            return value.username;
        });
        const username = newsData.username;
        if (!usernameDb.includes(String(username))) {
            db.query(`INSERT INTO ${tableName} SET ?`, newsData, function (err, res) {
                // console.log('error', err);
                if (err) {
                    result({ msg: ERROR }, null);
                    return;
                }
                result(null, { id: res.insertId });
            });
        } else {
            result({ msg: `User ${ALREADY_EXITS}` });
        }
    });
};

// update data by ID
Admins.updateById = (id, dataNew, result) => {
    const q = `SELECT username FROM ${tableName} WHERE id = ${id}`;
    db.query(q, (err, res) => {
        if (res && res[0]?.username === dataNew.username) {
            // console.log(res.username);
            db.query(
                `UPDATE ${tableName} SET name = ?, username = ?, active = ?, updated_at = ?  WHERE id = ?`,
                [dataNew.name, dataNew.username, dataNew.active, dataNew.updated_at, id],
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
        } else {
            result({ msg: `Username ${NOT_EXITS}` });
        }
    });
};

// update data by ID
Admins.updateActiveById = (id, active, result) => {
    db.query(`UPDATE ${tableName} SET active = ? WHERE id = ?`, [active, id], (err, res) => {
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
Admins.remove = (id, result) => {
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

Admins.updateRefreshToken = (id, tokenRefresh) => {
    const qe = `UPDATE ${tableName} SET refreshToken = ? WHERE id = ?`;
    db.query(qe, [tokenRefresh, id]);
};

module.exports = Admins;
