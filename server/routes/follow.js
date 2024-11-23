const userModel = require('../schemas/userSchema');
const validateToken = require('../common/validateToken');

const followLogic = async ({req, res}) =>{
    let data = req.body;
    let { token, targetId } = data;

    if (!token) res.status(401).send("Unauthorized");
    let tokenRes = await validateToken(token);
    if (tokenRes.error) {
        res.status(401).send(tokenRes.message);
        return;
    }
    try {
        let { _id } = tokenRes.userData;
        const mongo_response = await userModel.findByIdAndUpdate(targetId, {
            $push: {
                followers: _id
            }
        })
        res.status(200).send(mongo_response);
        return;
    } catch (e) {
        console.log(e);
    }
}

module.exports = followLogic;