const express = require('express');

const connect = require('./common/connectToDB');

const {login, signup, follow} = require("./routes/user.js");
const {makePost, makeComment} = require('./routes/post.js');

const app = express();
const port = 9090;

app.use(express.json());
app.use(signup);
app.use(login);
app.use(makePost);
app.use(makeComment);
app.use(follow);

connect();

app.listen(port, ()=>{
    console.log(`server running at port ${port}`);
    
})
