const { request, response } = require('express');
let express = require('express');
let app = express();
const path = require('path');

app.use(express.static('public_html'));
app.use(express.urlencoded());
app.use(express.json());


app.get('/', async (req, res) => {
    try {
        res.send("<h1>Hello World</h1>");
    } catch (e) {
        res.status(500).send("<h1> Error! </h1>")
    }
});

app.post('/login', async (request, response) => {
    try {
        // console.log(request.body);
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
    // console.log(path.join(__dirname));
    response.sendFile(path.join(__dirname, 'public_html', 'chairResponse.html'));
})

app.listen(8000, () => {
    console.log('Server listening to port 8000, go to https://localhost:8000');
});