module.exports = class Streams {

  constructor() {
    invokeStreams()
  }

  getMsgs() {
    let currentMsgs = msgs
    msgs = []
    return currentMsgs
  }

};


const Masto = require('mastodon-api')
const maxMsgsAmount = 1000

let count = 0
let msgs = []


function connectApi(apiUrl, accessToken) {

  let apiConnection = new Masto({
    access_token: accessToken,
    timeout_ms:   60*1000,
    api_url:      apiUrl,
  });

  return apiConnection
}


function invokeStream(apiConnection, streamName='public') {
  // streamName = 'public'       // global
  // streamName = 'public/local' // local
  // streamName = 'user'         // home
  // streamName = 'direct'       // messages

  let stream = apiConnection.stream('streaming/' + streamName)

  listenStream(stream)

  return stream
}


function listenStream(stream) {

  stream.on('message', (msg) => {
    onMsg(msg)
  });

  stream.on('error', (err) => {
      console.log(err)
  });

  stream.on('heartbeat', (msg) => {
      console.log('heartbeat')
  });

}


function onMsg(msg) {
  count += 1
  let content = ''
  let meta = ''
  let output = ''
  if(msg.data.account !== undefined) {
    if(msg.data.account.acct !== undefined) {
      meta = msg.data.account.acct
    }
    if(msg.data.account.display_name !== undefined) {
      meta = msg.data.account.display_name
    }
  }
  if(msg.data.content !== undefined) {
    content = msg.data.content
  }
  if(content != '') {
    output = `
      <div class="post">
        ${content}
        <div class="meta">
          ${meta}
        </div>
      </div>
    `
    msgs.push(output)
  }
  if(msgs.length > maxMsgsAmount) {
    msgs.splice(0, maxMsgsAmount/2)
    count = 0
  }
}
function invokeStreams() {
  let creds = process.env.CREDS
  creds = JSON.parse(creds)
  for(let key in creds) {
    let accessToken = creds[key]
    let apiUrl = key + '/api/v1/'
    let apiConnection = connectApi(apiUrl, accessToken)
    invokeStream(apiConnection)
  }
}