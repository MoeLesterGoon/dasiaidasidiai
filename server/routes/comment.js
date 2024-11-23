const userModel = require('../schemas/userSchema');
const commentModel = require('../schemas/commentSchema');
const postModel = require('../schemas/postSchema');

const makeComment = async({req, res}) =>{
    let data = req.body;
    let {token, postId, content } = data;

    if (!token) res.status(401).send("Unauthorized");
    let tokenRes = await validateToken(token);
    if (tokenRes.error) {
        res.status(401).send(tokenRes.message);
        return;
    }
    try {
        let { username, _id } = tokenRes.userData;
        let mongo_response = await commentModel.create({
            username,
            userId : _id,
            postId,
            likes: [0, new Set()],
            replies: new Set(),
            content,
        })

        const updateUser = userModel.findByIdAndUpdate(_id, {
            $push: {
                comments: mongo_response._id
            }
        })
        const updatePost = postModel.findByIdAndUpdate(postId, {
            $push: {
                comments: mongo_response._id
            }
        })

        await Promise.all([updateUser, updatePost])
        
        res.status(200).send(mongo_response);
        return;
    } catch (e) {
        console.log(e);
    }
}

module.exports = makeComment;