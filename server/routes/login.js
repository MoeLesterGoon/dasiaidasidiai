const { Router } = require('express');
const jtw_secret = require('../secrets/JWT');
const userModel = require('../schemas/userSchema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = Router();

async function findAccount (data){
    const {username, email} = data;
    const account = await userModel.findOne({email, username});
    return account;
}
login.post('/login', async(req, res) =>{
    let data = req.body
    const {token} = data;

    if(token){
        jwt.verify(token, jtw_secret, (error, user) =>{
            if(error){
                res.send("Token is invalid or expired")
                return;
            }
            let account;
            findAccount(user).then((data) =>{
                account = Object.keys(data._doc);
                if(account.length == 0){
                    res.send("This account doesnt exist, please login again");
                    return;
                }  
            })        
            res.send("accepted")
        })
    }else{
        if(!data.username) res.send({error: 400, reason: "missing username"});
        if(!data.email) res.send({error: 400, reason: "missing email"});
        if(!data.password) res.send({error: 400, reason: "missing password"});
        
        const account = findAccount(data);
        let isValid;
        
        bcrypt.compare(data.password, account.password, function(err, result) {
            if(err) console.log(err);
            isValid = result
        });

        if(isValid){
            const token = jwt.sign(data, jtw_secret);
            res.send(token);
        }
        res.send("error")
    }
});

module.exports = login;
