'use strict';

const express = require('express');
const jsonParser = express.json();
const logger = require('../logger');

const folderRouter = express.Router();
const bodyParser = express.json();
const FolderService = require('./folder-service');

folderRouter

  .route('/api/folder')
  .get((req, res, next) => {
    const db = req.app.get('db');
    FolderService.getAllFolders(db)
      .then((folders) => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    let { folder_name:title, id } = req.body;
    if (!title) {
      logger.error('title is required');
      return res.status(400).send('title is required field');
    }

    const newFolder = { folder_name:title, id };
    FolderService.insertFolder(req.app.get('db'), newFolder).then(
      (folder) => {
        logger.info(`folder created`);
        res
          .status(201)
          .location(`/api/folder/${folder.id}`)
          .json(folder);
      }
    );
  });

folderRouter
  .route('/api/folder/:id')
  .get((req, res, next) => {
    const db = req.app.get('db');
    const { id } = req.params;
    FolderService.getById(db, id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder does not exist` },
          });
        }
        res.json(folder);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    FolderService.deleteFolder(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
