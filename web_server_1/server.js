let express = require('express');
let app = express();

app.get('/', async(req, res) => {
    try{
        res.send("<h1>Hello World</h1>");
    }catch(e){
        res.status(500).send("<h1> Error! </h1>")
    }
});

app.listen(8000, () => {
    console.log('Server listening to port 8000, go to https://localhost:8000');
});