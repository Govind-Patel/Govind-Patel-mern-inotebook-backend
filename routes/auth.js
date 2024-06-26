const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

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
        
    
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exits"})
    }
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })
    res.json(user);
    } catch (error) {
          console.log(error.message);
          res.status(500).send("Some error occured");
    }
    // .then(user=> res.json(user))
    // .catch(error => {console.log(error)
    // res.json({error: 'Please enter a uniqe for email',message:error.message})})
})

module.exports = router