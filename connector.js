const Files = require('./files.js')
const Masto = require('mastodon-api')


module.exports = class Connector {

  constructor(credentialsAsJsonStr) {

    if(credentialsAsJsonStr !== undefined) {
      return connectApis(credentialsAsJsonStr)
    }
console.debug('ohoh')

/*
    // When running locally we cannot read creds from process.env,
    // read of file and extract json-str:
    Files.read('.env', function(content) {
      content = content.trim()
      credentialsAsJsonStr = content.slice(7, content.length-1)
      return connectApis(credentialsAsJsonStr)
    });
*/
  }
}


function connectApi(apiUrl, accessToken) {

  let apiConnection = new Masto({
    access_token: accessToken,
    timeout_ms:   60*1000,
    api_url:      apiUrl,
  });
  console.debug('\nConnected to "' + apiUrl + '" with ' + accessToken.slice(0, 7))

  return apiConnection
}


function connectApis(credentialsAsJsonStr) {

  let apiConnections = []

  let creds = JSON.parse(credentialsAsJsonStr)

  for(let key in creds) {
    
    let accessToken = creds[key]
    let apiUrl = key + '/api/v1/'
    let apiConnection = connectApi(apiUrl, accessToken)
    apiConnections.push(apiConnection)

  }

  return apiConnections
}
