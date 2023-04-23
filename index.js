const express = require('express');

const app = express();

app.use(express.static(__dirname + '/'));

app.listen(1432);
console.log("Listening on http://localhost:1432/");
