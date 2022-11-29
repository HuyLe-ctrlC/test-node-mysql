const db = require('./connectDB');
const tableName = 'tbl_awgs';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Awgs = function (awgs) {
    this.code = awgs.code;
    this.name = awgs.name;
    this.min_value = awgs.min_value;
    this.max_value = awgs.max_value;
    this.publish = awgs.publish;
    this.sort = awgs.sort;
    this.created_at = awgs.created_at;
    this.updated_at = awgs.updated_at;
};

// select data all
Awgs.getAll = (dataSearch, limit, offset, orderby, result) => {
    let query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby}`;
    if (limit) {
        query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby} LIMIT ?,?`;
    }
    if (dataSearch.keyword && limit) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE code LIKE "%${keyword}%" OR  name LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" ORDER BY id ${orderby} LIMIT ?,?`;
    }
    if (dataSearch.keyword && !limit) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE code LIKE "%${keyword}%" OR  name LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" ORDER BY id ${orderby}`;
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

//select code and name
Awgs.filterData = (dataSearch, result) => {
    let query = `SELECT * FROM ${tableName} WHERE code LIKE '%${dataSearch}%' OR name LIKE '%${dataSearch}%'`;
    db.query(query, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, res);
    });
};

// select data by ID
Awgs.findById = (id, result) => {
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
Awgs.create = (newsData, result) => {
    const q = `SELECT code FROM ${tableName}`;
    db.query(q, (err, res) => {
        // console.log(err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const codeDb = res.map((value, i) => {
            return value.code;
        });
        const code = newsData.code;
        if (!codeDb.includes(String(code))) {
            db.query(`INSERT INTO ${tableName} SET ?`, newsData, function (err, res) {
                // console.log(err, res);
                if (err) {
                    // console.log('error', err);
                    result({ msg: ERROR }, null);
                    return;
                }
                result(null, { id: res.insertId });
            });
        } else {
            result({ msg: `Code ${ALREADY_EXITS}` });
        }
    });
};

// update data by ID
Awgs.updateById = (id, dataNew, result) => {
    const q = `SELECT code FROM ${tableName} WHERE id = ${id}`;
    db.query(q, (err, res) => {
        console.log(err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res[0].code === dataNew.code) {
            db.query(
                `UPDATE ${tableName} SET code = ?, name = ?, min_value = ?, max_value = ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`,
                [
                    dataNew.code,
                    dataNew.name,
                    dataNew.min_value,
                    dataNew.max_value,
                    dataNew.publish,
                    dataNew.sort,
                    dataNew.updated_at,
                    id,
                ],
                (err, res) => {
                    if (err) {
                        console.log(err);
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
            result({ msg: `Code ${NOT_EXITS}` });
        }
    });
};

// update data by ID
Awgs.updatePublishById = (id, publish, result) => {
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

// update sort by ID
Awgs.updateSortById = (id, sort, result) => {
    db.query(`UPDATE ${tableName} SET sort = ? WHERE id = ?`, [sort, id], (err, res) => {
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
Awgs.remove = (id, result) => {
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

module.exports = Awgs;
