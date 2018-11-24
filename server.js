const getterRoutes = ['', 'index', 'send', 'sources']

const templatesPath = __dirname + '/frontend/templates/'



const files = require('./backend/helpers/files.js')

const bodyParser = require("body-parser")

const express = require('express')

const app = express()


function setupApp() {

  app.use(express.static('frontend'))

  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(bodyParser.json())

}


function listenGetRequests() {
  // Point each route to template of same name.
  // If route is root, point to template of next route.

  for(let i in getterRoutes) {

    let route = getterRoutes[i]

    let templateName = route

    if(route == '') templateName = getterRoutes[Number(i) + 1]

    app.get('/' + route, (request, response) => {

      response.sendFile(templatesPath + templateName + '.html')

    });
  }


  // Special getters:

  app.get("/msgs", (request, response) => {
    response.send(app.river.getMessages())
  });


  app.get("/received", (request, response) => {
    let sendedResponse = request.query["sendedResponse"]
    if(sendedResponse === undefined) {
      sendedResponse =
        'Error: No query-param named "sendedResponse" was found as expected!'
    }
    response.send(sendedResponse)
  });

}


function listenPostRequests() {

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
      let fieldType = fieldName.split('.')
      fieldType = fieldType[fieldType.length-1]
      let sourceName = fieldName.slice(0, fieldName.length-fieldType.length-1)
      config.sources[sourceName].streamTypes[fieldType].selected = true
    }

    app.river.updateConfig(config)  // set modified copy as new config

    response.redirect('/')

  });

}


function main() {
  setupApp()
  listenGetRequests()
  listenPostRequests()
}



exports.Server = class Server {
  constructor(river) {
    app.river = river
    main()
  }
  serve(portNr=8080) {
    const listener = app.listen(portNr, (err) => {
      console.log('\nRiver flows to port', portNr)
    });
  }
}
