const configurator = require('./backend/configurator')
const River = require('./backend/river').River
const Server = require('./server').Server

const paths = {
  data: {
    backend: 'backend/data/config.json',
    frontend: 'frontend/data/config.json'
  },
  form: 'frontend/templates/config.html',
  secret: '.env'
}


function intializeAndServeRiver(credentials, config) {
  let river  = new River(credentials, config)
  let server = new Server(river)
  server.serve()
}


configurator.ini(paths, intializeAndServeRiver)
