const db = require('./connectDB');
const tableName = 'tbl_districts';
const tableNameCity = 'tbl_city';
// const tableNameWards = 'tbl_wards';
const City = require('./city.model');
const { query } = require('./connectDB');
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Districts = function (districts) {
    this.code = districts.code;
    this.name = districts.name;
    this.cityID = districts.cityID;
    this.publish = districts.publish;
    this.sort = districts.sort;
    this.created_at = districts.created_at;
    this.updated_at = districts.updated_at;
};

//select all districts
Districts.getAll = (dataSearch, limit, offset, orderby, result) => {
    let query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby} LIMIT ?,?`;
    if (dataSearch.keyword) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" OR cityID LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" OR cityID LIKE "%${keyword}%" ORDER BY id ${orderby} LIMIT ?,?`;
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
//select districts by id
Districts.getByID = (id, result) => {
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
Districts.create = (newsData, result) => {
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
            const q = `SELECT id FROM ${tableNameCity}`;
            db.query(q, (err, res) => {
                // console.log(err);
                const idDb = res.map((value, i) => {
                    return value.id;
                });
                const cityID = newsData.cityID;
                // console.log(typeof idDb[1]);
                // console.log(typeof parseInt(cityID));
                // console.log(idDb.includes(parseInt(cityID)));
                if (idDb.includes(parseInt(cityID))) {
                    db.query(`INSERT INTO ${tableName} SET ?`, [newsData], function (err, res) {
                        if (err) {
                            // console.log('error', err);
                            result({ msg: ERROR }, null);
                            return;
                        }
                        result(null, { id: res.insertId });
                    });
                } else {
                    result({ msg: `cityID ${NOT_EXITS}` });
                }
            });
        } else {
            result({ msg: `Code ${ALREADY_EXITS}` });
        }
    });
};

// update data by ID
Districts.updateById = (id, dataNew, result) => {
    const qe = `SELECT code FROM ${tableName} WHERE id = ${id}`;
    db.query(qe, (err, res) => {
        console.log(err);

        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res[0].code === dataNew.code) {
            const q = `SELECT id FROM ${tableNameCity}`;
            db.query(q, (err, res) => {
                const idDb = res.map((value, i) => {
                    return value.id;
                });
                const cityID = dataNew.cityID;
                // console.log(typeof idDb[1]);
                // console.log(typeof parseInt(cityID));
                // console.log(idDb.includes(parseInt(cityID)));
                if (idDb.includes(parseInt(cityID))) {
                    const q = `UPDATE ${tableName} SET code = ?, name = ?, cityID = ?, publish = ?, updated_at = ?  WHERE id = ?`;
                    db.query(
                        q,
                        [dataNew.code, dataNew.name, dataNew.cityID, dataNew.publish, dataNew.updated_at, id],
                        (err, res) => {
                            console.log(err);
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
                    result({ msg: `cityID ${NOT_EXITS}` });
                }
            });
        }
        // const codeDb = res.map((value, i) => {
        //     return value.code;
        // });
        // const code = dataNew.code;
        // console.log(codeDb.includes(String(code)));
        // if (!codeDb.includes(String(code))) {
        else {
            result({ msg: `Code ${NOT_EXITS}` });
        }
    });
};

// update data by ID
Districts.updatePublishById = (id, publish, result) => {
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
Districts.updateSortById = (id, sort, result) => {
    db.query(`UPDATE ${tableName} SET sort = ? WHERE id = ?`, [sort, id], (err, res) => {
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
    });
};

// remove data by ID
Districts.remove = (id, result) => {
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

Districts.searchDictricts = (query, result) => {
    const q = `SELECT ${tableName}.name FROM ${tableName} INNER JOIN ${tableNameCity} ON ${tableName}.cityID = ${tableNameCity}.id WHERE ${tableNameCity}.id = ${query}`;
    db.query(q, (err, res) => {
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
    });
};

module.exports = Districts;
