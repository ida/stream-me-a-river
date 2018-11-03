const files = require('./files.js');
const Connector = require('./connector.js');
const apiConnections = new Connector(process.env.CREDS);
const maxMsgsAmount = 500

let count = 0
let msgs = []


module.exports = class Streams {

  constructor() {
    invokeStreams()
  }

  getMsgs() {
    let currentMsgs = msgs
    msgs = []
    return currentMsgs
  }

  invokeStreams() {
    invokeStreams()
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


function invokeStreams() {
  
  let allowedStreamTypes = ['public', 'public/local', 'user', 'direct']//, 'messages']
  let streamType  = null
  let streamTypes = null

  files.readFile('public/config.json', function(fileContent) {

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
