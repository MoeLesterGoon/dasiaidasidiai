const { Router } = require('express');
const jtw_secret = require('../secrets/JWT');
const validateToken = require('../common/validateToken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../schemas/userSchema');

const login = Router();

const manual = async ({res, data}) =>{
    let id = data._id
    const account = await userModel.findOne({id})
    try{
        isValid = await bcrypt.compare(data.password, account.password);
        if(isValid){
            const token = jwt.sign(data, jtw_secret);
            res.send(token);
            return;
        }
    }catch(e){
        console.log(e);
    }
    res.send("error")
}

login.post('/login', async(req, res) =>{
    let data = req.body
    const {token} = data;

    if(token){
        validateToken(token).then(({error, message}) =>{
            if(error){
                res.status(401).send(message);
                return;
            }
            res.status(200).send(message);

        });
    }else{
        if(!data.username) res.status(400).send("missing username");
        if(!data.email) res.status(400).send("missing email");
        if(!data.password) res.status(400).send("missing password");
        
        manual({res, data})
    }
});

module.exports = login;
