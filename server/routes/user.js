const jtw_secret = require('../secrets/JWT');
const userModel = require('../schemas/userSchema');

const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10; 

const dataValidation = async({username, password, email}) => {
    //Email
    if(!email) return {type: "rejected", error: "No email described"};
    if(!(email.includes("@"))) return {type: "rejected", error: "Invalid Email"};
    let dbEmail = await userModel.findOne({ "email": email });
    if(dbEmail !== null) return {type: "rejected", error: "Email Already exists"};

    //Password
    const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[\w!@#$%^&*(),.?":{}|<>]{8,}$/gi;
    if(!password) return {type: "rejected", error: "No password described"};
    if(!(passRegex.test(password))) return {type: "rejected", error: "password must be at least 8 charachters of length, must include special characters"}

    //Username
    if(!username) return {type: "rejected", error: "No Username Described"};
    let dbUsername = await userModel.findOne({ "username": username});
    if(dbUsername !== null) return({type: "rejected", error: "An Account with that username Already exists"});

    return({type: "accepted"});
}

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

const loginLogic = ({req, res}) =>{
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
        
        manual({res, data});
    }
}
const signupLogic = async ({req, res}) =>{
    let data = req.body;
    let {username, password, email} = data;
    const data_status = await dataValidation(data);
    if(data_status.type == "rejected"){
        res.send(data_status.error);
        return;
    }
    password = await bcrypt.hash(password, saltRounds);

    let mongo_response;
    try{
        mongo_response = await userModel.create({
            username,
            password,
            email,
            created_at: new Date(),
            followers: new Set()
        })
        console.log(mongo_response);
        
    }catch(e){
        console.log(e);
    }
    let plain_object = {};
    Object.keys(mongo_response._doc).forEach((key) =>{
        const item = mongo_response[key];
        plain_object[key] = item;
    })
    
    const token = jwt.sign(plain_object, jtw_secret);
    res.send(token);
}

module.exports = {loginLogic, signupLogic}