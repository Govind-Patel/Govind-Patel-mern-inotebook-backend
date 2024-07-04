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

// Route 3 update an existing  New using: POST "api/notes/updatenote". Login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
  const {title , description , tag } = req.body;
  // create a newnote object 
  const newNote = {};
  if(title){newNote.title = title};
  if(description){newNote.description = description};
  if(tag){newNote.tag = tag};
  // find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(400).send("not found") };
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not allowed"); 
    }
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true});
    res.json({note});
})

module.exports = router;