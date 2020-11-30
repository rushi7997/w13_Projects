'use strict';
const express = require('express');
const app = express();

const cors = require('cors')
const logger = require('morgan')

app.use(express.static('public_html'))
app.use(cors())

app.use(express.json())
app.use(logger('dev'));

app.use(express.urlencoded({
    extended: true
}))

// GET /tracks
app.get('/tracks', async (request, response) => {
    const DB = require('./src/dao');
    DB.connect();

    await DB.query('SELECT * from track order by id asc', (tracks) => {
        const tracksJSON = {
            tracks: tracks.rows
        };
        const tracksJSONString = JSON.stringify(tracksJSON, null, 4);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        // DB.disconnect();
        response.end(tracksJSONString);
    });
});

// DELETE /tracks/123
app.delete('/tracks/:id', (request, response) => {
    const id = request.params.id;
    const DB = require('./src/dao');
    DB.connect();

    DB.queryParams('DELETE from track WHERE id=$1', [id], () => {
        response.writeHead(200, {
            'Content-Type': 'text/json'
        });
        DB.disconnect();
        const officesJSONString = JSON.stringify({
            message: 'OK track deleted'
        }, null, 4);
        response.end(officesJSONString);
    });
});

//POST /tracks
app.post('/tracks', (request, response) => {
    const DB = require('./src/dao');
    const trackData = {
        id: request.body.id,
        playlist_id: request.body.playlist_id,
        title: request.body.title,
        uri: request.body.uri,
        master_id: request.body.master_id
    };
    DB.connect()
    let insertQuery = 'insert into track(id, playlist_id, title, uri, master_id)';
    insertQuery += ' VALUES($1,$2,$3,$4,$5)';
    const queryParams = [trackData.id, trackData.playlist_id, trackData.title, trackData.uri, trackData.master_id];
    DB.queryParams(insertQuery, queryParams, () => {
        const statusCode = 200;
        const msg = 'Successfully inserted data';
        const error = null;
        response.writeHead(statusCode, {
            'Content-Type': 'application/json'
        });
        const officesJSONString = JSON.stringify({
            message: msg
        }, null, 4);
        DB.disconnect();
        response.end(officesJSONString);
    });
});

// GET /playlist
app.get('/playlist', async (request, response) => {
    const DB = require('./src/dao');
    DB.connect();

    await DB.query('SELECT * from playlist order by id asc', (playlist) => {
        const playlistJSON = {
            playlist: playlist.rows
        };
        const playlistJSONString = JSON.stringify(playlistJSON, null, 4);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        // DB.disconnect();
        response.end(playlistJSONString);
    });
});

app.listen(3001, () => {
    console.log(`Server listening to port 8000, go to http://localhost:3001`);
});