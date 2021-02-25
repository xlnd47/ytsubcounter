require('dotenv').config();
const getYoutubeSubscriber = require('getyoutubesubscriber');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { setIntervalAsync } = require('set-interval-async/dynamic');

const express = require('express');
const app = express();
const port = process.env.PORT | 3000;

const adapter = new FileSync('db.json');
const db = low(adapter);
const moment = require('moment');

db.defaults({ counts: [] }).write();

let dbJson = require('./db.json');

setIntervalAsync(
    async () => {
        let subcount = await getYoutubeSubscriber(process.env.YOUTUBE_CHANNEL_ID);
        db.get('counts')
            .push({ date: moment().format(), subcount: subcount})
            .write();


    },
    process.env.POLLING_MINUTES * 60 * 1000 
); 


app.get('/', (req, res) => {
    res.send(db.get('counts').values())
});

app.listen(port, () => {
    console.log(`listening at port ${port}`)
});