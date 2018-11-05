const Files = require('./files.js');
const Connector = require('./connector.js');

const maxMsgsAmount = 500

let count = 0
let msgs = []
let apiConnections = null



module.exports = class Streams {

  constructor() {
    getCredsAndConnectToApis()
  }

  getMsgs() {
    let currentMsgs = msgs
    msgs = []
    return currentMsgs
  }

  invokeStreams() {
    invokeStreams(apiConnections)
  }

}


function connectAndStream(credentialsAsJsonStr) {
  apiConnections = new Connector(credentialsAsJsonStr)
  invokeStreams(apiConnections)
}


function getCredsAndConnectToApis() {

  let credentialsAsJsonStr = null

  // If app runs on glitch.com, get creds from process:
  if(process.env.CREDS !== undefined) {
    credentialsAsJsonStr = process.env.CREDS
    connectAndStream(credentialsAsJsonStr)
  }
  // If app runs locally, get creds from secret-file:
  else {
    Files.read('.env', function(content) {
      // We expect content to be CREDS='{ ... }' and cut off everything
      // before and after curly brackets to get the json-str:
      content = content.trim() // remove possible trailing spcaes
      credentialsAsJsonStr = content.slice(7, content.length-1)
      connectAndStream(credentialsAsJsonStr)
    });
  }

}


function invokeStream(apiConnection, streamName) {
  // streamName = 'public'       // Federation timeline
  // streamName = 'public/local' // Instance timeline
  // streamName = 'user'         // Home timeline
  // streamName = 'direct'       // Direct messages

  let stream = apiConnection.stream('streaming/' + streamName)

  console.log('\nStreaming', stream.requestOptions.url)

  listenStream(stream)

  return stream

}


function invokeStreams(apiConnections) {

  let allowedStreamTypes = ['public', 'public/local', 'user', 'direct']//, 'messages']
  let streamType  = null
  let streamTypes = null

  Files.read('public/config.json', function(fileContent) {

    streamTypes = JSON.parse(fileContent)

    for(let key in streamTypes) {

      if(allowedStreamTypes.indexOf(streamTypes[key]) != -1) {

        for(let j in apiConnections) {

          invokeStream(apiConnections[j], streamTypes[key])
        }
      }
      else {
        console.log('Warning: Ignoring "' +  streamTypes[key] +                   '", because it\'s not an allowed stream-type.')
      }
    }
  });
}


function listenStream(stream) {

  stream.on('message', (msg) => {
    onMsgArrival(msg)
  });

  stream.on('error', (err) => {
      console.log(err)
  });

  stream.on('heartbeat', (msg) => {
      console.log('heartbeat')
  });

}


function onMsgArrival(msg) {
  count += 1
  let content = ''
  let meta = ''
  let output = ''
  if(msg.data.account !== undefined) {
    if(msg.data.account.acct !== undefined) {
      meta = msg.data.account.acct
    }
    if(msg.data.account.username !== undefined) {
      meta = msg.data.account.username
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
