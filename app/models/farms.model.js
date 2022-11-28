const db = require('./connectDB');
const tableName = 'tbl_farms';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;
const Farms = function (product) {
    this.id = product.id;
    this.code = product.code;
    this.name = product.name;
    this.phone = product.phone;
    this.cityID = product.cityID;
    this.districtID = product.districtID;
    this.wardID = product.wardID;
    this.address = product.address;
    this.publish = product.publish;
    this.sort = product.sort;
    this.created_at = product.created_at;
    this.updated_at = product.updated_at;
};

//select data all
Farms.getAll = (dataSearch, limit, offset, orderby, result) => {
    let query = `SELECT *, (SELECT COUNT(*) from ${tableName}) as total FROM ${tableName} ORDER BY id ${orderby} LIMIT ?,?`;
    if (dataSearch.keyword) {
        let keyword = dataSearch.keyword;
        query = `SELECT *, (SELECT COUNT(*) from ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" OR phone LIKE "%${keyword}%" OR cityID LIKE "%${keyword}%" OR districtID LIKE "%${keyword}%" OR wardID LIKE "%${keyword}%" ) as total FROM ${tableName} WHERE code LIKE "%${keyword}%" OR name LIKE "%${keyword}%" OR phone LIKE "%${keyword}%" OR cityID LIKE "%${keyword}%" OR districtID LIKE "%${keyword}%" OR wardID LIKE "%${keyword}%" ORDER BY id ${orderby} LIMIT ?,?`;
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
Farms.findById = (id, result) => {
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
Farms.create = (data, result) => {
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
Farms.updateById = (data, result) => {
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
            const q = `UPDATE ${tableName} SET code = ?, name= ?,phone = ?,cityID = ?,districtID = ?,wardID = ?,address=?, publish = ?, sort = ?, updated_at = ? WHERE id = ?`;

            db.query(
                q,
                [
                    data.code,
                    data.name,
                    data.phone,
                    data.cityID,
                    data.districtID,
                    data.wardID,
                    data.address,
                    data.publish,
                    data.sort,
                    data.updated_at,
                    data.id,
                ],
                (err, res) => {
                    // console.log(err);
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
Farms.updatePublishById = (id, publish, result) => {
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
Farms.updateSortById = (id, sort, result) => {
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
Farms.remove = (id, result) => {
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

module.exports = Farms;
