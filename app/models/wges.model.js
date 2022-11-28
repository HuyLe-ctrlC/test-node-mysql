const db = require('./connectDB');
const tableName = 'tbl_wges';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Wges = function (product) {
    this.id = product.id;
    this.code = product.code;
    this.name = product.name;
    this.min_value = product.min_value;
    this.max_value = product.max_value;
    this.publish = product.publish;
    this.sort = product.sort;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
};

//select data all
Wges.getAll = (dataSearch, limit, result) => {
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
        like = `WHERE name LIKE "%${keyword}%" OR code LIKE "%${keyword}%" `;
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
Wges.findById = (id, result) => {
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
Wges.create = (data, result) => {
    const q = `SELECT code FROM ${tableName}`;

    db.query(q, (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const codeDb = res.map((value, i) => {
            return value.code;
        });
        const code = data.code;
        if (!codeDb.includes(String(code))) {
            const q = `INSERT INTO ${tableName} SET ?`;

            db.query(q, [data], (err, res) => {
                if (err) {
                    result({ msg: ERROR }, null);
                    return;
                }
                result(null, { id: res.insertId });
            });
        } else {
            result({ msg: `Code ${ALREADY_EXITS}` }, null);
        }
    });
};

//update data by id
Wges.updateById = (data, result) => {
    const q = `SELECT code FROM ${tableName} WHERE id = ?`;
    db.query(q, [data.id], (err, res) => {
        console.log(err);
        if (res && res.length === 0) {
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const code = data.code;

        if (res[0].code === code) {
            const q = `UPDATE ${tableName} SET code = ?, name= ?,min_value = ?,max_value = ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;

            db.query(
                q,
                [
                    data.code,
                    data.name,
                    data.min_value,
                    data.max_value,
                    data.publish,
                    data.sort,
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
                        result({ mess: `ID ${NOT_EXITS}` }, null);
                        return;
                    }
                    result(null, res);
                },
            );
        } else {
            result({ msg: `Code ${NOT_EXITS}` }, null);
        }
    });
};

//update publish by id
Wges.updatePublishById = (id, publish, result) => {
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
Wges.updateSortById = (id, sort, result) => {
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
Wges.remove = (id, result) => {
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

module.exports = Wges;
