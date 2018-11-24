const templatesPath = __dirname + '/frontend/templates/'

const files = require('./backend/helpers/files.js')

const bodyParser = require("body-parser")

const express = require('express')

const app = express()


app.use(express.static('frontend'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())



app.get("/", (request, response) => {
  response.sendFile(templatesPath + 'index.html')
});


app.get("/sources", (request, response) => {
  response.sendFile(templatesPath + 'sources.html')
});


app.get("/msgs", (request, response) => {
  response.send(app.river.getMessages())
});



app.get("/send", (request, response) => {
  response.sendFile(templatesPath + 'send.html')
});



app.get("/received", (request, response) => {
  let sendedResponse = request.query["sendedResponse"]
  if(sendedResponse === undefined) {
    sendedResponse =
      'Error: No query-param named "sendedResponse" was found as expected!'
  }
  response.send(sendedResponse)
});



app.post("/send", (request, response) => {
  app.river.sendMessage(request.body, function(sendedResponse) {
    sendedResponse = encodeURI(sendedResponse)
    response.redirect('/received?sendedResponse=' + sendedResponse)
  });
});


app.post("/sources", (request, response) => {

  let config = app.river.config       // create copy of config
  let selectedFields = request.body

  for(let source in config.sources) { // deselect all fields in copy
    let streamTypes = config.sources[source].streamTypes
    for(let fieldType in streamTypes) {
      streamTypes[fieldType].selected = false
    }
  }

  for(let fieldName in selectedFields) { // select new userchoice in copy
    let fieldType = fieldName.split('.'); fieldType = fieldType[fieldType.length-1]
    let sourceName = fieldName.slice(0, fieldName.length-fieldType.length-1)
    config.sources[sourceName].streamTypes[fieldType].selected = true
  }

  app.river.updateConfig(config)  // set modified copy as new config

  response.redirect('/')

});



exports.Server = class Server {
  constructor(river) {
    app.river = river
  }
  serve(portNr=8080) {
    const listener = app.listen(portNr, (err) => {
      console.log('\nRiver flows to port', portNr)
    });
  }
}
