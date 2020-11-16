'use strict';

let express = require('express');
let app = express();
const cors = require('cors');
const logger = require('morgan');
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.set('views engine', 'ejs');
app.use(express.static('public_html'));
app.use(logger('dev'));
const path = require('path');

//GET /offices
app.get('/offices', async (request, response) => {
    try {
        let DB = require('./src/dao');
        DB.connect();
        await DB.query('SELECT * from offices', (offices) => {
            const officesJSON = {offices: offices.rows};
            const officesJSONString = JSON.stringify(officesJSON, null, 4);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(officesJSONString);
        });
    } catch (e) {
        response.status(500).json({message: e.message});
    }
});

// GET /offices/34
app.get('/offices/:id', async (request, response) => {
    try {
        let DB = require('./src/dao');
        DB.connect();
        let id = request.params.id;
        await DB.queryParams('SELECT * from offices where officecode=$1', [id], (offices) => {
            // console.log(offices.rows[0]);
            const officesJSON = offices.rows[0];
            const officesJSONString = JSON.stringify(officesJSON, null, 4);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(officesJSONString);
        });
    } catch (e) {
        response.status(500).json({message: e.message});
    }
});

//POST /offices
app.post('/offices', async (request, response) => {
    try {
        let {
            officecode,
            city,
            phone,
            addressline1,
            addressline2,
            state,
            country,
            postalcode,
            territory
        } = request.body;
        console.log(officecode);
        console.log(city);
        let DB = require('./src/dao');
        DB.connect();
        await DB.queryParams('INSERT INTO offices(officecode, city, phone, addressline1, addressline2, state, country, postalcode, territory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
            [officecode, city, phone, addressline1, addressline2, state, country, postalcode, territory],
            (res) => {
                console.log(res);
                response.sendFile(path.join(__dirname, 'public_html', 'index.html'));
                // const officesJSON = {"message": "success"};
                // const officesJSONString = JSON.stringify(officesJSON, null, 4);
                // response.writeHead(200, {'Content-Type': 'application/json'});
                // response.end(officesJSONString);
            });
    } catch (e) {
        response.status(500).json({message: e.message});
    }
});

//PUT offices/34
app.put('/offices/:id', async (request, response) => {
    try {
        let {
            city,
            phone,
            addressline1,
            addressline2,
            state,
            country,
            postalcode,
            territory
        } = request.body;
        let officecode = request.params.id;
        let DB = require('./src/dao');
        DB.connect();
        await DB.queryParams('UPDATE offices \n' +
            '\tSET city=$1, phone=$2, addressline1=$3, addressline2=$4, state=$5, country=$6, postalcode=$7, territory=$8\n' +
            '\tWHERE officecode=$9;', [city, phone, addressline1, addressline2, state, country, postalcode, territory, officecode],
            (res) => {
                console.log(res);
                const officesJSON = {"message": "success"};
                const officesJSONString = JSON.stringify(officesJSON, null, 4);
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(officesJSONString);
            });
    } catch (e) {
        response.status(500).json({message: e.message});
    }
});

// DELETE offices/34
app.delete('/offices/:id', async (request, response)=> {
    try{
        let officecode = request.params.id;
        let DB = require('./src/dao');
        DB.connect();
        await DB.queryParams('DELETE from offices WHERE officecode=$1', [officecode], () => {
            const officesJSON = {"message": "Deleted"};
            const officesJSONString = JSON.stringify(officesJSON, null, 4);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(officesJSONString);
        });
    } catch (e) {
        response.status(500).json({message: e.message});
    }
});

app.listen(8000, () => {
    console.log('Server listening to port 8000, go to https://localhost:8000');
});