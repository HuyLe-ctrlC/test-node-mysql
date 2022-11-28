const db = require('./connectDB');
const tableName = 'tbl_users';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const User = function (user) {
    this.fullname = user.fullname;
    this.phone = user.phone;
    this.email = user.email;
    this.gender = user.gender;
    this.birthday = user.birthday;
    this.password = user.password;
    this.active = user.active;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
};

// select data all
User.getAll = (dataSearch, limit, result) => {
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
        like = `WHERE fullname LIKE "%${keyword}%"`;
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
User.findById = (id, result) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        // console.log("found todo: ", res[0]);
        result(null, res[0]);
    });
};

// insert db
User.register = (newsData, result) => {
    db.query(`INSERT INTO ${tableName} SET ?`, newsData, function (err, res) {
        if (err) {
            // console.log('error', err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

User.updateById = (id, dataNew, result) => {
    const query = `UPDATE ${tableName} SET fullname = ?, phone = ?, gender = ?, birthday = ?, active = ?,  updated_at = ? WHERE id = ?`;
    db.query(
        query,
        [dataNew.fullname, dataNew.phone, dataNew.gender, dataNew.birthday, dataNew.active, dataNew.updated_at, id],
        (err, res) => {
            if (err) {
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

// remove data by ID
User.remove = (id, result) => {
    db.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
        if (err) {
            result(null, err);
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

module.exports = User;
