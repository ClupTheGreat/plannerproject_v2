const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let router = express.Router();
let appRoutes = require('./app/routes/api')(router);

app.use(morgan(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + `/public`))
app.use('/api', appRoutes);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
    console.log(`Running the server on port ` + port);
});
