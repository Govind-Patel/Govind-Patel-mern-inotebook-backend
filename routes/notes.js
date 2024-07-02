const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//route 1 Get All the Notes using: GET "api/notes/fetchallnotes". Login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
  try {
    const notes = await Notes.find({user:req.user.id});
    res.send(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
})

// Route 2 Add a New using: POST "api/notes/addnote". Login required
router.post('/addnote',fetchuser,[
    body("title", 'Enter a valid title').isLength({ min: 3 }),
    body("description",'Description must be atleast 5 character').isLength({ min: 5 }),
],async(req,res)=>{
    try {
    const {title, description , tag} = req.body;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }

    const note = new Notes({
        title,description,tag,user:req.user.id
    })
    const saveNote = await note.save();
    res.send(saveNote);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
})

module.exports = router;