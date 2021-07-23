//'use strict';

/* Data Access Object (DAO) module for accessing memes */

const db = require('./db');


// get allmemes
exports.getMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'select title, m.id, i.id imageID, protect, font, color, width, height, x, y, p.id phrase, text, path, u.name, u.id user , p.property property FROM meme  m, property_image  pi, phrase p, image i, user u  WHERE m.id = p.meme AND p.property = pi.id AND i.id = m.image AND u.id = m.user';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let memes = [];
            if (rows.length > 0) {

                memes = rows.reduce(function (obj, row) {
                    const id = row.id;
                    if (!obj[id])
                        obj[id] = {
                            id: id,
                            title: row.title,
                            protect: row.protect,
                            nameCreator: row.name,
                            user: row.user,
                            color: row.color,
                            font: row.font,
                            image: {
                                id: row.imageID,
                                name: row.name,
                                path: row.path
                            },
                            phrases: [
                                {
                                    id: row.phrase,
                                    property: row.property,
                                    text: row.text,
                                    width: row.width,
                                    height: row.height,
                                    x: row.x,
                                    y: row.y,
                                }]
                        }
                    else
                        obj[id].phrases.push({
                            id: row.phrase,
                            property: row.property,
                            text: row.text,
                            width: row.width,
                            height: row.height,
                            x: row.x,
                            y: row.y,
                        })

                    return obj;
                }, {});
            }
            resolve(Object.values(memes));
        });
    });
};

// get public memes
exports.getPublicMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'select title, m.id, i.id imageID, protect, font, color, width, height, x, y, p.id phrase, text, path, u.name FROM meme  m, property_image  pi, phrase p, image i, user u  WHERE m.id = p.meme AND p.property = pi.id AND i.id = m.image AND u.id = m.user AND protect = 0';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let memes = [];
            if (rows.length > 0) {

                memes = rows.reduce(function (obj, row) {
                    const id = row.id;
                    if (!obj[id])
                        obj[id] = {
                            id: id,
                            title: row.title,
                            protect: row.protect,
                            nameCreator: row.name,
                            color: row.color,
                            font: row.font,
                            image: {
                                id: row.imageID,
                                name: row.name,
                                path: row.path
                            },
                            phrases: [
                                {
                                    id: row.phrase,
                                    text: row.text,
                                    width: row.width,
                                    height: row.height,
                                    x: row.x,
                                    y: row.y,
                                }]
                        }
                    else
                        obj[id].phrases.push({
                            id: row.phrase,
                            text: row.text,
                            width: row.width,
                            height: row.height,
                            x: row.x,
                            y: row.y,
                        })

                    return obj;
                }, {});
            }
            resolve(Object.values(memes));
        });
    });
};


// get all images
exports.getImages = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT i.id id, name, path, pi.id propertyID FROM image i, property_image pi WHERE i.id = pi.image';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            let images = [];
            if (rows.length > 0) {

                images = rows.reduce(function (obj, row) {
                    const id = row.id;
                    if (!obj[id])
                        obj[id] = {
                            id: id, name: row.name, path: row.path, phrases: [row.propertyID]
                        }
                    else
                        obj[id].phrases.push(row.propertyID)

                    return obj;
                }, {});

            }
            resolve(Object.values(images));
        });
    });
};


//create a new meme
exports.createMeme = (user, meme) => {

    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO MEME(title, image, protect, user, font, color)  VALUES(?, ?, ?, ?, ?, ?)';
        db.run(sql, [meme.title, meme.image, meme.protect, user, meme.font, meme.color], function (err) {
            if (err) {
                console.log(err)
                reject(err);
                return;
            } else {
                const flatPhrases = [];
                meme.phrases.forEach((p) => {
                    flatPhrases.push(this.lastID);
                    const obj = { text: p.text, property: p.id }
                    Object.values(obj).forEach((val) => flatPhrases.push(val))
                });
                const parametricRow = meme.phrases.map((r) => '(?, ?, ?)').join(',');

                let sql = 'INSERT INTO phrase(meme, text, property) VALUES ' + parametricRow;
                db.run(sql, flatPhrases, function (err) {
                    if (err) {
                        console.log(err)
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                })
            }
        })
    })
}

// delete meme by id
exports.deleteMeme = (userID, memeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM meme WHERE id = ? AND user = ?';
        db.all(sql, [memeID, userID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });
};


