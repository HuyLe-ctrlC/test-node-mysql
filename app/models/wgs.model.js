const db = require('./connectDB');
const tableName = 'tbl_wgs';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Wgs = function (wgs) {
    this.id = wgs.id;
    this.name = wgs.name;
    this.publish = wgs.publish;
    this.cow_breeds_id = wgs.cow_breeds_id;
    this.weight_p0_id = wgs.weight_p0_id;
    this.sort = wgs.sort;
    this.created_at = wgs.created_at;
    this.updated_at = wgs.updated_at;
};

//select data all
Wgs.getAll = (dataSearch, limit, result) => {
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
        like = `WHERE name LIKE "%${keyword}%" `;
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
Wgs.findById = (id, result) => {
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
Wgs.create = (data, result) => {
    const q = `INSERT INTO ${tableName} SET ?`;
    db.query(q, [data], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};

//update data by id
Wgs.updateById = (data, result) => {
    const q = `UPDATE ${tableName} SET name= ?, publish = ?,  cow_breeds_id = ?, weight_p0_id = ?, sort = ?, updated_at = ? WHERE id = ?`;

    db.query(
        q,
        [data.name, data.publish, data.cow_breeds_id, data.weight_p0_id, data.sort, data.updated_at, data.id],
        (err, res) => {
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
};

//update publish by id
Wgs.updatePublishById = (id, publish, result) => {
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
Wgs.updateSortById = (id, sort, result) => {
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
Wgs.remove = (id, result) => {
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

module.exports = Wgs;
