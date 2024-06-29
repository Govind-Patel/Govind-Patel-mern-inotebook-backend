const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = "Govindisgooddb$ag"; 

// create a user usnig: post "api/auth/createuser". No login require
router.post('/createuser',[
    body("name", 'Enter a valid number').isLength({ min: 3 }),
    body("email",'Enter a valid email').isEmail(),
    body("password",'Password must be atleast 5 character').isLength({ min: 5 }),
],async(req,res)=>{
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        //  check whether the user with this email exists already 
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({error: "Sorry a user with this email already exits"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password,salt);
        // create a new user 
        user = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email
        })
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        res.json({authToken});
        // console.log(jwtData);
        // res.json(user);
    } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal server error");
    }
    // .then(user=> res.json(user))
    // .catch(error => {console.log(error)
    // res.json({error: 'Please enter a uniqe for email',message:error.message})})
})

//  authenticate a user using: POST "api/auth/login". no login required 
router.post('/login',[
        body("email",'Enter a valid email').isEmail(),
        body("password",'Password cannot be blank').exists(),
    ],  async(req,res)=>{
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const {email,password} = req.body;
        try {
            let user = await User.findOne({email});
            if(!user){
                res.status(400).json({errors:"Please try to login with correct credentials"});
            }
            const passCompare = await bcrypt.compare(password,user.password);
            if(!passCompare){
                res.status(400).json({errors:"Please try to login with correct credentials"});
            }
            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data,JWT_SECRET);
            res.json({authToken});
        } catch (error) {
            console.log(error.message);
            // res.status(500).send("Internal server error");
        }
})

module.exports = router