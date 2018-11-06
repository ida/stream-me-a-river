const Streams = require('./streams.js')

const river = new Streams()

const files = require('./files.js')

const bodyParser = require("body-parser")

const express = require('express')

const app = express()


app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())


app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
});


app.get("/config", (request, response) => {
  response.sendFile(__dirname + '/views/config.html')
});


app.post("/config", (request, response) => {

  files.writeFile(
    'public/config.json',
    JSON.stringify(request.body),
    river.invokeStreams()
  );

  response.redirect('/')

});


app.get("/msgs", (request, response) => {

  response.send(river.getMsgs())

});



const listener = app.listen(8080, (err) => {

  console.log('\nListening to port', listener.address().port);

});
