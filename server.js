const Streams = require('./streams.js');
const river = new Streams();

const express = require('express')
const app = express()


app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
});

app.get("/controls", (request, response) => {
  response.sendFile(__dirname + '/views/controls.html')
});

app.get("/msgs", (request, response) => {
  response.send(river.getMsgs())
});


const listener = app.listen(process.env.PORT, () => {  
  console.log('Your app is listening on port ' + listener.address().port);
});