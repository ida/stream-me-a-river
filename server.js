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


app.get("/config", (request, response) => {
  response.sendFile(templatesPath + 'config.html')
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


app.post("/config", (request, response) => {
  let config = app.river.config
  let selectedFields = request.body

  // Write frontend-config:
  files.write(config.paths.data.frontend, JSON.stringify(selectedFields))


  // Update config-object:

  for(let source in config.sources) { // deselect all fields
    let streamTypes = config.sources[source].streamTypes
    for(let fieldType in streamTypes) {
      streamTypes[fieldType].selected = false
    }
  }

  for(let fieldName in selectedFields) { // select new userchoice
    let fieldType = fieldName.split('.')
    fieldType = fieldType[fieldType.length-1]
    let sourceName = fieldName.slice(0, fieldName.length-fieldType.length-1)
    config.sources[sourceName].streamTypes[fieldType].selected = true
  }

  app.river.updateConfig(config)


  // Go to main-page:
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
