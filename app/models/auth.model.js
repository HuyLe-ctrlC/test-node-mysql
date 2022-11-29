const db = require('./connectDB');
const tableName = 'tbl_users';
const constants = require('../config/constants');
const bcrypt = require('bcryptjs');

const { ERROR, ALREADY_EXITS, NOT_EXITS } = constants.constantNotify;

const Auth = function (auth) {
    this.fullname = auth.fullname;
    this.phone = auth.phone;
    this.email = auth.email;
    this.gender = auth.gender;
    this.birthday = auth.birthday;
    this.password = auth.password;
    this.active = auth.active;
    this.created_at = auth.created_at;
    this.updated_at = auth.updated_at;
};
// insert db
Auth.register = (newsData, result) => {
    db.query(`INSERT INTO ${tableName} SET ?`, newsData, function (err, res) {
        if (err) {
            // console.log('error', err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId });
    });
};
//Reset Password
Auth.updatePasswordById = (id, passwordNew, passwordCurrent, result) => {
    db.query(
        `SELECT * FROM ${tableName} WHERE id = ${id}`,

        async (err, res) => {
            if (err) {
                result({ msg: ERROR }, null);
                return;
            }
            const passMatch = await bcrypt.compare(passwordCurrent.password, res[0].password);
            if (passMatch) {
                const hashPass = await bcrypt.hash(passwordNew, 12);
                // console.log(hashPass);
                db.query(`UPDATE ${tableName} SET password = ? WHERE id = ${id}`, hashPass, (err, res) => {
                    // console.log(err, res);
                    if (err) {
                        result({ msg: ERROR }, null);
                        return;
                    }
                    if (res.affectedRows === 0) {
                        // not found todo with the id
                        result({ msg: `ID ${NOT_EXITS}` }, null);
                        return;
                    }
                    result(null, res);
                    return;
                });
            } else {
                result({ msg: 'Mật khẩu cũ không đúng' });
            }
        },
    );
};

module.exports = Auth;
