'use strict';

const express = require('express');
const jsonParser = express.json();
const logger = require('../logger');
const { v4: uuid } = require('uuid');

const notesRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('../notes-service');
const NotesService = require('./notes-service');

notesRouter

  .route('/api/note')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NotesService.getAllNotes(db)
      .then((notes) => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    let { title, content, date_modified, folderId } = req.body;
    if (!title) {
      logger.error('title is required');
      return res.status(400).send('title is required field');
    }
    if (!content) {
      logger.error('url required');
      return res.status(400).send('url is required');
    }
    if (!folderId) {
      logger.error('folder is required');
      return res
        .status(400)
        .send('folder is required');
    }

    //const id = uuid();

    const newNote = { title, content, date_modified, folderId };
    console.log('note from add', newNote);
    NotesService.insertNote(
      req.app.get('db'),
      newNote
    ).then((note) => {
      logger.info(`note created`);
      console.log('note res', note);
      res
        .status(201)
        .location(`/api/note/${note.id}`)
        .json(note);
    });
  });

notesRouter
  .route('/api/note/:id')
  .get((req, res, next) => {
    const db = req.app.get('db');
    const { id } = req.params;
    NotesService.getById(db, id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note does not exist` },
          });
        }
        res.json(note);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    console.log(req.params);
    NotesService.deleteNote(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, date_modified, folderId } = req.body;
    const noteToUpdate = { title, content, date_modified, folderId };
    const numberOfVals = Object.values(noteToUpdate).filter(
      Boolean
    ).length;
    if (numberOfVals === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain at least one edit',
        },
      });
    }
    NotesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;