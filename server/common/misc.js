const userModel = require('../schemas/userSchema');

const findAccount = async(_id) =>{
    return await userModel.findOne({_id});
}
module.exports = findAccount;

