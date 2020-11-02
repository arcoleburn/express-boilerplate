'use strict';

const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('note');
  },
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('Note')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from('Note')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteNote(knex, id) {
    return knex('Note').where({ id }).delete();
  },
  updateNote(knex, id, newNoteFields) {
    return knex('Note')
      .where({ id })
      .update(newNoteFields);
  },
};

module.exports = NotesService;
