'use strict';

/* DB access module */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('memeDB.sqlite', sqlite.OPEN_READWRITE, (err) => {
    if (err) throw err;
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;