const db = require('./connectDB');
const tableName = 'tbl_product_cates';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;
const ProductCates = function (product) {
    this.id = product.id;
    this.code = product.code;
    this.name = product.name;
    this.publish = product.publish;
    this.sort = product.sort;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
};
//OR code LIKE "%${keyword}%"
//select data all
ProductCates.getAll = (dataSearch, limit, result) => {
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
        like = `WHERE name LIKE "%${keyword}%" OR code LIKE "%${keyword}%" `;
        query = `SELECT *, (SELECT COUNT(*) FROM ${tableName} ${like}) as total FROM ${tableName} ${like} ORDER BY id ${orderBy} LIMIT ?,?`;
    }
    if (dataSearch.keyword && !limit) {
        keyword = dataSearch.keyword;
        like = `WHERE name LIKE "%${keyword}%" OR code LIKE "%${keyword}%" `;
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

//select data all by id
ProductCates.findById = (id, result) => {
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
ProductCates.create = (data, result) => {
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
ProductCates.updateById = (data, result) => {
    const q = `SELECT code FROM ${tableName} WHERE id = ?`;
    db.query(q, [data.id], (err, res) => {
        // console.log(res);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res && res.length === 0) {
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        const code = data.code;
        // console.log(typeof codeDb[1]);
        // console.log(codeDb.includes(parseInt(code)));
        if (res[0].code === code) {
            const q = `UPDATE ${tableName} SET code = ?, name= ?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;

            db.query(q, [data.code, data.name, data.publish, data.sort, data.updated_at, data.id], (err, res) => {
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
        } else {
            result({ msg: `Code ${NOT_EXITS}` }, null);
        }
    });
};

//update publish by id
ProductCates.updatePublishById = (id, publish, result) => {
    const q = `UPDATE ${tableName} SET publish = ? WHERE id = ?`;

    db.query(q, [publish, id], (err, res) => {
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

//update sort by id
ProductCates.updateSortById = (id, sort, result) => {
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
ProductCates.remove = (id, result) => {
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

module.exports = ProductCates;
