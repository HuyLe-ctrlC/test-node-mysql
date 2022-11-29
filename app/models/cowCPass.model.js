const db = require('./connectDB');
const tableName = 'tbl_cow_cpass';
const constants = require('../config/constants');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const CowCPass = function (cPass) {
    this.id = cPass.id;
    this.name = cPass.name;
    this.card_number = cPass.card_number;
    this.cPass = cPass.cPass;
    this.date_added = date_added.cPass;
    this.cow_group = cPass.cow_group;
    this.cow_breek = cPass.cow_breek;
    this.farm = cPass.farm;
    this.gender = cPass.gender;
    this.image = cPass.image;
    this.birth_of_date = cPass.birth_of_date;
    this.pss = cPass.pss;
    this.age = cPass.age;
    this.pnow = cPass.pnow;
    this.conditions = cPass.conditions;
    this.weight_gain_effect = cPass.weight_gain_effect;
    this.avg_weight_gain = cPass.avg_weight_gain;
    this.sort = cPass.sort;
    this.created_at = cPass.created_at;
    this.updated_at = cPass.updated_at;
};

//select data all
CowCPass.getAll = (dataSearch, limit, result) => {
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
CowCPass.findById = (id, result) => {
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
CowCPass.create = (data, result) => {
    const q = `SELECT cPass FROM ${tableName}`;

    db.query(q, (err, res) => {
        console.log(err);
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const cPassDb = res?.map((value, i) => {
            return value.cPass;
        });
        const cPass = data.cPass;
        // console.log('cPass:', typeof cPass);
        // console.log('cPassDb:', typeof cPassDb);
        if (!cPassDb.includes(parseInt(cPass))) {
            console.log(123);
            const q = `INSERT INTO ${tableName} SET ?`;

            db.query(q, [data], (err, res) => {
                if (err) {
                    console.log(err);
                    result({ msg: ERROR }, null);
                    return;
                }
                result(null, { id: res.insertId });
            });
        } else {
            result({ msg: `cPass ${ALREADY_EXITS}` }, null);
        }
    });
};

//update data by id
CowCPass.updateById = (data, result) => {
    const q = `SELECT cPass FROM ${tableName} WHERE id = ?`;
    db.query(q, [data.id], (err, res) => {
        if (res && res.length === 0) {
            result({ msg: `ID ${NOT_EXITS}` }, null);
            return;
        }
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        const cPass = data.cPass;
        console.log(cPass);
        console.log(res[0].cPass);

        if (res[0].cPass == cPass) {
            const q = `UPDATE ${tableName} SET name= ?,card_number = ?,date_added = ?,cow_group = ?,cow_breek = ?, farm = ?, gender = ?, image = ?, birth_of_date = ?, pss = ?, age = ?, pnow = ?, conditions = ?, weight_gain_effect = ?, avg_weight_gain = ?, sort = ?, updated_at = ? WHERE id = ?`;

            db.query(
                q,
                [
                    data.name,
                    data.card_number,
                    data.date_added,
                    data.cow_group,
                    data.cow_breek,
                    data.farm,
                    data.gender,
                    data.image,
                    data.birth_of_date,
                    data.pss,
                    data.age,
                    data.pnow,
                    data.conditions,
                    data.weight_gain_effect,
                    data.avg_weight_gain,
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
            result({ msg: `cPass ${NOT_EXITS}` }, null);
        }
    });
};

//update publish by id
CowCPass.updatePublishById = (id, publish, result) => {
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
CowCPass.updateSortById = (id, sort, result) => {
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
CowCPass.remove = (id, result) => {
    const q = `DELETE FROM ${tableName} WHERE id =?`;

    db.query(q, [id], (err, res) => {
        if (err) {
            result({ msg: ERROR }, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found data with the id
            result({ msg: `ID ${NOT_EXITS} ` }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = CowCPass;
