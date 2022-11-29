const db = require('./connectDB');
const tableName = 'tbl_conditions';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Conditions = function (product) {
    this.id = product.id;
    this.code = product.code;
    this.name = product.name;
    this.color_text = product.color_text;
    this.color_bg = product.color_bg;
    this.publish = product.publish;
    this.sort = product.sort;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
};

//select data all
Conditions.getAll = (dataSearch, limit, offset, orderby, result) => {
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

//select data all by id
Conditions.findById = (id, result) => {
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
Conditions.create = (data, result) => {
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
        // console.log(typeof codeDb[1]);
        // console.log(codeDb.includes(parseInt(code)));
        if (!codeDb.includes(String(code))) {
            const q = `INSERT INTO ${tableName} SET ?`;

            db.query(q, [data], (err, res) => {
                // console.log(err, res);
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
Conditions.updateById = (data, result) => {
    const q = `SELECT code FROM ${tableName} WHERE id = ?`;
    db.query(q, [data.id], (err, res) => {
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
            const q = `UPDATE ${tableName} SET code = ?, name= ?,color_text = ?,color_bg = ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;

            db.query(
                q,
                [
                    data.code,
                    data.name,
                    data.color_text,
                    data.color_bg,
                    data.publish,
                    data.sort,
                    data.updated_at,
                    data.id,
                ],
                (err, res) => {
                    if (err) {
                        result({ msg: ERROR }, null);
                        return;
                    }
                    if (res.affectedRows === 0) {
                        //not found id
                        result({ msg: `ID ${NOT_EXITS}` }, null);
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
Conditions.updatePublishById = (id, publish, result) => {
    const q = `UPDATE ${tableName} SET publish = ? WHERE id = ?`;

    db.query(q, [publish, id], (err, res) => {
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
    });
};

//update sort by id
Conditions.updateSortById = (id, sort, result) => {
    const q = `UPDATE ${tableName} SET sort = ? WHERE id = ?`;

    db.query(q, [sort, id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows === 0) {
            //not found id
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        result(null, res);
    });
};
//delet data by id
Conditions.remove = (id, result) => {
    const q = `DELETE FROM ${tableName} WHERE id =?`;

    db.query(q, [id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows === 0) {
            // not found data with the id
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Conditions;
