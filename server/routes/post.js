const validateToken = require('../common/validateToken');

const postModel = require('../schemas/postSchema');
const userModel = require('../schemas/userSchema');

const makePostLogic = async ({req, res}) =>{
    let data = req.body;
    let { postImg, title, description, token } = data;

    if (!token) res.status(401).send("Unauthorized");
    let tokenRes = await validateToken(token);
    if (tokenRes.error) {
        res.status(401).send(tokenRes.message);
        return;
    }
    try {
        let { username, _id } = tokenRes.userData;
        let mongo_response = await postModel.create({
            username,
            userId : _id,
            likes: [0, new Set()],
            comments: new Set(),
            title,
            postImg,
            description
        })

        await userModel.findByIdAndUpdate(_id, {
            $push: {
                posts: mongo_response._id
            }
        })
        
        res.status(200).send(mongo_response);
        return;
    } catch (e) {
        console.log(e);
    }
}

module.exports = makePostLogic;