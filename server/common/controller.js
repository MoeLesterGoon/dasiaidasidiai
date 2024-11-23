const {Router} = require('express');
const commentLogic = require('../routes/comment');
const {loginLogic, signupLogic} = require('../routes/user');
const followLogic = require('../routes/follow');
const newPostLogic = require('../routes/post');

// const makeComment = Router();
// const login = Router();
// const signup = Router();
// const follow = Router();

const [makeComment, login, signup, follow, makePost] = [Router(), Router(), Router(), Router(), Router()];

makeComment.post('/newComment', (req, res) => {
    commentLogic({req, res})
});
login.post('/login', (req, res) =>{
    loginLogic({req, res});
});
signup.post('/signup', (req, res) =>{
    signupLogic({req, res});
});
follow.post('/follow', (req, res) =>{
    followLogic({req, res})
});
makePost.post('/newPost', (req, res) =>{
    newPostLogic({req, res});
})

module.exports = {makeComment, login, signup, follow, makePost};
