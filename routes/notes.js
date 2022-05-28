const notes = require('express').Router();
const fs = require('fs');
const { fstat } = require('fs');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');


// Get Route for retriving notes.html
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  
  readFromFile('./db/db.json').then((data) => {
    try {
      res.json(JSON.parse(data));
    } catch(err) {
      fs.writeFile('./db/db.json','[]', (err) =>
      err ? console.error(err) : console.log('Success!'));
      console.log(err)
    }
  });
});

// POST Route for submitting notes
notes.post('/', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit notes`);

  // Destructuring assignment for the items in req.body
  const {title, text } = req.body;
  console.log(title)
  console.log(text)
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      id: uuid(),
      title,
      text,
    };
    console.log(newNote);
    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

notes.delete('/:id', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to delete notes`);

  // Destructuring assignment for the items in req.body
  const {id} = req.params;
  if (id) {
    console.log(id);
  readFromFile('./db/db.json').then((data) => {
    try {
      const notes =JSON.parse(data);
      for (let i=0; i<notes.length; i++){
        if(notes[i].id===id){
          notes.splice(i,1);
        }
        fs.writeFile('./db/db.json',JSON.stringify(notes), (err) =>
      err ? console.error(err) : console.log('Success!'));
      };
    } catch(err) {
        console.log(err)
    }
  });
    const response = {
      status: 'success',
      body: notes,
    };

    res.json(response);
  } else {
    res.json('Error in deleting note');
  }
});

module.exports = notes;
