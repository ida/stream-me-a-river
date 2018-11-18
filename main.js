const configurator = require('./backend/config')
const files = require('./backend/helpers/files')
const River = require('./backend/river').River
const Server = require('./server').Server


function compareSourcesAndUpdateConfig(credentials, config) {
  for(url in credentials) {
    // Get source-name by convention from URL minus protocol:
    let sourceName = url
    let protocol = ''
    if(sourceName.startsWith('http://')) protocol = 'http://'
    if(sourceName.startsWith('https://')) protocol = 'https://'
    sourceName = sourceName.slice(protocol.length)
    // Source of credentials is not in sources of config:
    if(config.sources[sourceName] === undefined) {
      // Add entry with default-values:
      config.sources[sourceName] = config.sources.default
    }
  }
  configurator.updateConfig(config)
}
function readSourcesOfSecretFile(config, callback1, callback2) {
  files.read('.env', function(credentials) {
    credentials = credentials.trim()
    credentials = credentials.slice(7, credentials.length-1)
    credentials = JSON.parse(credentials)

    callback1(credentials, config)
    callback2(credentials, config)
  });
}
function intializeAndServeRiver(credentials, config) {
  let river  = new River(credentials, config)
  let server = new Server(river)
  server.serve()
}

function main(config) {

  readSourcesOfSecretFile(config,

    compareSourcesAndUpdateConfig,

    intializeAndServeRiver)

}

exports.main = main
