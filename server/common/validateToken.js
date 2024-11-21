const jtw_secret = require('../secrets/JWT');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../schemas/userSchema');

const validateToken = async (token) => {
    let userData = await jwt.verify(token, jtw_secret);
    let id = userData._id;
    let DBdata = await userModel.findOne({id})
    if(!DBdata) return({error: true, message: "this no bueno"})
    let account = Object.keys(DBdata._doc);

    if (account.length == 0) {
        return({ error: true, message: "This account doesnt exist, please login again" });
    }
    try {
        isValid = await bcrypt.compare(userData.password, DBdata.password);
        if (isValid || userData.password == DBdata.password) {
            return({ error: false, message: "OK", userData});
        }
    } catch (e) {
        console.log(e);
    }
    return({ error: true, message: "Invalid Token" })
}
module.exports = validateToken;