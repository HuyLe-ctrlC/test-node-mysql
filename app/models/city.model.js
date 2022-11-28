const db = require('./connectDB');
const tableName = 'tbl_city';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const City = function (city) {
    this.name = city.name;
    this.publish = city.publish;
    this.created_at = city.created_at;
    this.updated_at = city.updated_at;
};

// select data all
City.getAll = (dataSearch, limit, offset, orderby, result) => {
    let query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName}  ORDER BY id ${orderby} LIMIT ?,?`;
    if (dataSearch.keyword) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE  name LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE name LIKE "%${keyword}%" ORDER BY id ${orderby} LIMIT ?,?`;
    }
    db.query(query, [offset, limit], (err, res) => {
        console.log(err);
        if (err) {
            // console.log(err);
            result({ msg: ERROR }, null);
            return;
        }
        result(null, res);
    });
};

// select data by ID
City.findById = (id, result) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        } else {
            if (res && res[0] !== undefined) {
                result(null, res[0]);
            } else {
                result(null, null);
            }
        }
    });
};

// insert db
City.create = (newsData, result) => {
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
City.updateById = (id, dataNew, result) => {
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
City.updatePublishById = (id, publish, result) => {
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
City.remove = (id, result) => {
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

module.exports = City;
