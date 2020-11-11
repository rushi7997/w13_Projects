const { Client } = require('pg');

let DB = {};

/* connect() ******************************************************************/
function connect () {
    DB = new Client({
        host: 'localhost',
        port: 5432,
        database: 'new1',
        user: 'postgres',
        password: 'postgres'
    });
    DB.connect((error) => {
        if (error) {
            console.log('Database connection error', error.stack)
        } else {
            console.log('Database connected')
        }
    });
}

/* disconnect() - rarely used *******************************************/
function disconnect () {
    DB.end();
}

/* query - without params ********************************************/
function query (sqlStr, resultCallback) {
    DB.query(sqlStr, (error, result) => {
        if (error) {
            console.log('Query Error:' + error);
        } else {
            // console.log(result)
            // execute callback function (example display records)
            resultCallback(result);
        }
    })
}

/* query - with params ********************************************/
function queryParams (sqlStr, params, resultCallback) {
    // execute query
    DB.query(sqlStr, params, (error, result) => {
        if (error) {
            console.log('Query Error:' + error);
        } else {
            // console.log(result)
            // execute callback function (example display records)
            resultCallback(result);
        }
    })
}

// public interface of the module
module.exports = {
    connect: connect,
    disconnect: disconnect,
    query: query,
    queryParams: queryParams
};