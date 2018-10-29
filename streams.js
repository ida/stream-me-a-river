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

}


function invokeStream(apiConnection, streamName) {

  let stream = apiConnection.stream('streaming/' + streamName)

  listenStream(stream)

  return stream

}


function invokeStreams(streamName='public/local') {
  // streamName = 'public'       // Federation timeline
  // streamName = 'public/local' // Instance timeline
  // streamName = 'user'         // Home timeline
  // streamName = 'direct'       // Direct messages
  for(let i in apiConnections) {
    invokeStream(apiConnections[i], streamName)
  }
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