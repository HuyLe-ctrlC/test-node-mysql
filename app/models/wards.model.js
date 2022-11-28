const db = require('./connectDB');
const tableNameDistricts = 'tbl_districts';
const tableNameWards = 'tbl_wards';
const constants = require('../config/constants');
const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Wards = function (wards) {
    this.code = wards.code;
    this.name = wards.name;
    this.districtID = wards.districtID;
    this.publish = wards.publish;
    this.sort = wards.sort;
    this.created_at = wards.created_at;
    this.updated_at = wards.updated_at;
};

//select all wards
Wards.getAll = (dataSearch, limit, result) => {
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
    let query = `SELECT *, (SELECT COUNT(*) FROM ${tableNameWards}) as total FROM ${tableNameWards} ORDER BY id ${orderBy} LIMIT ?,?`;
    if (dataSearch.keyword) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%" OR code LIKE "%${keyword}%" `;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableNameWards} ${like}) as total FROM ${tableNameWards} ${like} ORDER BY id ${orderBy} LIMIT ?,?`;
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
// //select wards by id
Wards.getByID = (id, result) => {
    db.query(`SELECT * FROM ${tableNameWards} WHERE id = ${id}`, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        //console.log("id: ", res[0]);
        result(null, res[0]);
    });
};
// insert db
Wards.create = (newsData, result) => {
    const q = `SELECT code FROM ${tableNameWards}`;
    db.query(q, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const codeDb = res.map((value, i) => {
            return value.code;
        });
        const code = newsData.code;
        if (!codeDb.includes(String(code))) {
            const q = `SELECT id FROM ${tableNameDistricts}`;
            db.query(q, (err, res) => {
                const idDb = res.map((value, i) => {
                    return value.id;
                });
                const districtID = newsData.districtID;
                // console.log(typeof idDb[1]);
                // console.log(typeof parseInt(cityID));
                // console.log(idDb.includes(parseInt(cityID)));
                if (idDb.includes(parseInt(districtID))) {
                    db.query(`INSERT INTO ${tableNameWards} SET ?`, [newsData], function (err, res) {
                        if (err) {
                            // console.log('error', err);
                            result({ msg: ERROR }, null);
                            return;
                        }
                        result(null, { id: res.insertId });
                    });
                } else {
                    result({ msg: `districtID ${NOT_EXITS}` });
                }
            });
        } else {
            result({ msg: `Code ${ALREADY_EXITS}` });
        }
    });
};

// update data by ID
Wards.updateById = (id, dataNew, result) => {
    const qe = `SELECT code FROM ${tableNameWards} WHERE id = ${id}`;
    db.query(qe, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res[0].code === dataNew.code) {
            const q = `SELECT id FROM ${tableNameDistricts}`;
            db.query(q, (err, res) => {
                if (err) {
                    result({ msg: ERROR }, null);
                    return;
                }
                const idDb = res.map((value, i) => {
                    return value.id;
                });
                const districtID = dataNew.districtID;
                if (idDb.includes(parseInt(districtID))) {
                    db.query(
                        `UPDATE ${tableNameWards} SET code = ?, name = ?, districtID = ?, publish = ?, updated_at = ?  WHERE id = ?`,
                        [dataNew.code, dataNew.name, dataNew.districtID, dataNew.publish, dataNew.updated_at, id],
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
                    result({ msg: `districtID ${NOT_EXITS}` });
                }
            });
        } else {
            result({ msg: `Code ${NOT_EXITS}` });
        }
    });
};

// update data by ID
Wards.updatePublishById = (id, publish, result) => {
    db.query(`UPDATE ${tableNameWards} SET publish = ? WHERE id = ?`, [publish, id], (err, res) => {
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
Wards.updateSortById = (id, sort, result) => {
    db.query(`UPDATE ${tableNameWards} SET sort = ? WHERE id = ?`, [sort, id], (err, res) => {
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
Wards.remove = (id, result) => {
    db.query(`DELETE FROM ${tableNameWards} WHERE id = ?`, id, (err, res) => {
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
//tìm kiếm phường xã theo quận huyện.
Wards.searchWards = (query, result) => {
    const q = `SELECT ${tableNameWards}.name FROM ${tableNameWards} INNER JOIN ${tableNameDistricts} ON ${tableNameWards}.districtID = ${tableNameDistricts}.id WHERE ${tableNameDistricts}.id = ${query}`;
    db.query(q, (err, res) => {
        // console.log(err, res);
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

module.exports = Wards;
