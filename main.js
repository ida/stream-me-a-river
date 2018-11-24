const configurator = require('./backend/configurator')
const River = require('./backend/river').River
const Server = require('./server').Server


const paths = {
  data: {
    sources: 'backend/data/sources.json',
  },
  forms: {
    send: 'frontend/templates/send.html',
    sources: 'frontend/templates/sources.html'
  },
  secret: '.env'
}


function intializeAndServeRiver(credentials, config) {
  let river  = new River(credentials, config)
  let server = new Server(river)
  server.serve()
}


configurator.ini(paths, intializeAndServeRiver)
