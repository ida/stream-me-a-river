var fs = require('fs');
function writeFile(path, content="{'some': 'json'}") {
  fs.writeFile(path, content, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(content,"File '" + path + "' was saved!")
  });
}



const Streams = require('./streams.js');
const river = new Streams();

const express = require('express')
const app = express()
const bodyParser = require("body-parser");



app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
});

app.get("/config", (request, response) => {
  response.sendFile(__dirname + '/views/config.html')
});

app.post("/config", (request, response) => {
  writeFile('public/config.json', JSON.stringify(request.body))
  response.redirect('/')
});

app.get("/msgs", (request, response) => {
  response.send(river.getMsgs())
});


const listener = app.listen(process.env.PORT, () => {  
  console.log('Your app is listening on port ' + listener.address().port);
});