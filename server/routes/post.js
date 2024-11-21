const { Router } = require('express');
const validateToken = require('../common/validateToken');

const postModel = require('../schemas/postSchema');
const userModel = require('../schemas/userSchema');
const commentModel = require('../schemas/commentSchema');

const makePost = Router();
const makeComment = Router();
const follow = Router();

makePost.post('/newPost', async (req, res) => {
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
});

makeComment.post("/newComment", async (req, res) =>{
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

        await userModel.findByIdAndUpdate(_id, {
            $push: {
                comments: mongo_response._id
            }
        })
        await postModel.findByIdAndUpdate(postId, {
            $push: {
                comments: mongo_response.id
            }
        })
        
        res.status(200).send(mongo_response);
        return;
    } catch (e) {
        console.log(e);
    }
})
follow.post("./follow", async(req, res) =>{
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
        await userModel.findByIdAndUpdate(targetId, {
            $push: {
                followers: _id
            }
        })
        res.status(200).send(mongo_response);
        return;
    } catch (e) {
        console.log(e);
    }
})

module.exports = {makePost, makeComment, follow}