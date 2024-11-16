const express = require('express');

const connect = require('./common/connectToDB');
const signup = require('./routes/signup.js');

const app = express();
const port = 9090;

app.use(express.json());
app.use(signup);

connect();

app.listen(port, ()=>{
    console.log(`server running at port ${port}`);
    
})
