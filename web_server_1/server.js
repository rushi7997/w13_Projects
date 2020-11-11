'use strict';

// const { request, response } = require('express');
let express = require('express'); // to use express framework // npm
let app = express(); // initialization of express
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.static('public_html'));

app.use(express.urlencoded());
app.use(express.json());
app.set('views engine', 'ejs');

// for AJAX tests, returns the list of customers in a JSON string
app.get('/customers', function (request, response) {
    let DB = require('./src/dao');
    DB.connect();
    DB.query('SELECT * from customers',function (customers){
        const customersJSON={customers:customers.rows}
        const customersJSONString = JSON.stringify(customersJSON, null, 4)
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json'})
        // send out a string
        response.end(customersJSONString)
    })
});

// delete one customer
// note you cannot delete customers with orders
// to know customers that don't have an order run this query
// SELECT * from customers
// LEFT JOIN orders on customers.customernumber = orders.customernumber
// WHERE ordernumber IS NULL
// ORDER BY customers.customernumber ASC
// result: you can delete customernumber 477,480,481 and others
app.delete('/customers/:id', function (request, response) {
    let id=request.params.id // read the :id value send in the URL
    let DB = require('./src/dao');
    DB.connect();
    DB.queryParams('DELETE from customers WHERE customernumber=$1',[id],function (customers){
        response.writeHead(200, { 'Content-Type': 'text/html'})
        // send out a string
        response.end("OK customer deleted")
    })
});

app.post('/customer_search', (request, response)=> {
    let id = request.body.id;
    console.log(id);
    const DB = require('./src/dao');
    DB.connect();
    DB.query('SELECT * from customers where customernumber='+id, function (customers) {
        let html = ''
        html += 'name: ' + customers.rows[0].customername + '<br>';
        html += 'last name: ' + customers.rows[0].contactlastname + '<br>';
        html += 'first name: ' + customers.rows[0].contactfirstname + '<br>';
        html += 'phone: ' + customers.rows[0].phone + '<br>';
        html += 'address line 1: ' + customers.rows[0].addressline1 + '<br>';
        html += 'address line 2: ' + customers.rows[0].addressline2 + '<br>';
        html += 'city: ' + customers.rows[0].city + '<br>';
        html += 'state: ' + customers.rows[0].state + '<br>';
        html += 'postalcode: ' + customers.rows[0].postalcode + '<br>';
        html += 'country: ' + customers.rows[0].country + '<br>';

        // use the page template of course to display the list
        const pageData = {} // initialize empty object
        pageData.title = 'Customers List-blabla.com'
        pageData.description = 'Customers Number and Name'
        pageData.author = 'The blabla.com team'
        // send out the html table
        pageData.content = html
        response.render('master.ejs', pageData)
        DB.disconnect()
    })
})

app.get('/employees', function (request, response) {
    const DB = require('./src/dao')
    DB.connect()
    DB.query('SELECT * from employees', function (employees) {
        const employeesJSON={employees:employees.rows}
        const employeesJSONString = JSON.stringify(employeesJSON, null, 4)
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json'})
        // send out a string
        response.end(employeesJSONString)
    })
})


app.get('/customers_list', function (request, response) {
    const DB = require('./src/dao')
    DB.connect()
    DB.query('SELECT * from customers', function (customers) {
        let html = ''
        html += 'Number of customers: ' + customers.rowCount + '<br>'
        html += '<table>'
        for (let i = 0; i < customers.rowCount; i++) {
            html += '<tr><td>' + customers.rows[i].customernumber + '</td><td>' + customers.rows[i].customername + '</td></tr>'
        }
        html += '</table>'

        // use the page template of course to display the list
        const pageData = {} // initialize empty object
        pageData.title = 'Customers List-blabla.com'
        pageData.description = 'Customers Number and Name'
        pageData.author = 'The blabla.com team'
        // send out the html table
        pageData.content = html
        response.render('master.ejs', pageData)
        DB.disconnect()
    })
})


app.get('/', async (req, res) => {
    try {
        res.send("<h1>Hello World</h1>");
    } catch (e) {
        res.status(500).send("<h1> Error! </h1>");
    }
});

app.get('/seasons', (req, res) => {
    const pageData = {}
    pageData.title = "seasons"
    pageData.description = 'all the seasons';
    pageData.author = 'Rushi Rami';

    const seasons = [
        {id: 1, name: 'winter'},
        {id: 2, name: 'summer'},
        {id: 3, name: 'fall'}
    ];

    pageData.content = '<ul>';
    for (let i = 0; i < seasons.length; i++) {
        pageData.content += '<li>' + seasons[i].name + '</li>';
    }
    pageData.content += '</ul>';
    res.render('master.ejs', pageData);
})

app.get('/products', (req, res) => {
    const pageData = {}; // initialize empty object
    pageData.title = 'Product Catalog-blabla.com';
    pageData.description = 'Huge selection of products for all your needs';
    pageData.author = 'The blabla.com team';
    const products = [
        {id: 1, name: 'white shoes', price: '99.99'},
        {id: 2, name: 'black shoes', price: '69.99'},
        {id: 3, name: 'blue shoes', price: '79.99'}
    ];
    pageData.content = '<table>';
    for (let i = 0; i < products.length; i++) {
        pageData.content += '<tr><td>' + products[i].id + '</td>';
        pageData.content += '<td>' + products[i].name + '</td>';
        pageData.content += '<td>' + products[i].price + '</td>';
        pageData.content += '</tr>';
    }
    pageData.content += '</table>';
    res.render('master.ejs', pageData);
})




app.post('/login', async (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;
        const myUsername = 'rushi';
        const myPassword = 'password';

        if (username === myUsername && password === myPassword) {
            response.status(200).send("<h1>You are logged in!</h1>")
        } else {
            response.status(200).send('<h1>You entered Wrong Credentials</h1>')
        }
    } catch (e) {
        response.status(500).send("Error" + e);
    }
})

app.get('/chair', (request, response) => {
    response.sendFile(path.join(__dirname, 'public_html', 'chairResponse.html'));
})

app.listen(8000, () => {
    console.log('Server listening to port 8000, go to https://localhost:8000');
});