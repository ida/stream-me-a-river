const Masto = require('mastodon-api')


module.exports = class Connector {

  constructor(credentialsAsJsonStr) {
    return connectApis(credentialsAsJsonStr)
  }

}


function connectApi(apiUrl, accessToken) {

  let apiConnection = new Masto({
    access_token: accessToken,
    timeout_ms:   60*1000,
    api_url:      apiUrl,
  });

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