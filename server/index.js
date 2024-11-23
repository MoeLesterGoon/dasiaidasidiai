const express = require('express');

const connect = require('./common/connectToDB');
const {makeComment, login, signup, follow, makePost} = require('./common/controller');

const app = express();
const port = 9090;

app.use(express.json());
app.use([signup, login, makePost, makeComment, follow]);

connect();

app.listen(port, ()=>{
    console.log(`server running at port ${port}`);
})
