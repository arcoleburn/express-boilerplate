ALTER TABLE note
    ADD COLUMN folder_id INTEGER REFERENCES folder(id);