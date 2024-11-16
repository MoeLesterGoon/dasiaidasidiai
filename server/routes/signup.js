'use strict';

const { Router } = require('express');
const userModel = require('../schemas/userSchema');

const signup = Router();

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

signup.post('/signup', async (req, res) =>{
    let data = req.body;
    const {username, password, email} = data;
    const data_status = await dataValidation(data);
    if(data_status.type == "rejected"){
        res.send(data_status.error);
        return;
    }
    let mongo_response;
    try{
        mongo_response = await userModel.create({
            username,
            password,
            email,
            created_at: new Date()
        })
    }catch(e){
        console.log(e);
    }
    res.send(mongo_response);
});

module.exports = signup;