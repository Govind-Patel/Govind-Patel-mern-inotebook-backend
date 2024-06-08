const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// create a user usnig: post "api/auth/createuser". No login require
router.post('/',[
    body("name", 'Enter a valid number').isLength({ min: 3 }),
    body("email",'Enter a valid email').isEmail(),
    body("password",'Password must be atleast 5 character').isLength({ min: 5 }),
],(req,res)=>{
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    }).then(user=> res.json(user))
    .catch(error => {console.log(error)
    res.json({error: 'Please enter a uniqe for email',message:error.message})})
})

module.exports = router