const Masto = require('mastodon-api')
const files = require('./helpers/files')
const Stream = require('./stream').Stream


exports.Source = class Source {


  constructor(name, apiUrl, accessToken, streamTypesObj, messageHandler) {
    this.name = name
    this.streams = []
    this.connection = new Masto({ api_url: apiUrl, access_token: accessToken })
    this.streamTypes = this.getStreamTypes(streamTypesObj)
    this.startStreams(this.connection, this.streamTypes, messageHandler)
  }


  getStreamTypes(streamTypesObj) {
    let streamTypes = []
    for(let i in streamTypesObj) {
      let streamTypeObj = streamTypesObj[i]
      if(streamTypeObj.selected === true) {
        streamTypes.push(streamTypeObj.value)
      }
    }
    return streamTypes
  }


  startStreams(connection, streamTypes, messageHandler) {

    let streams = this.streams

    for(let i in streamTypes) {

      let stream = new Stream (connection, streamTypes[i])

      console.log('Started stream', stream.requestOptions.url)

      streams.push(stream)

      stream.on('message', function(message) {

        let content = message.data.content
        let meta = null

        if(message.data.account !== undefined) {
          let account = message.data.account
          if(account.acct !== undefined && meta === null) meta = account.acct
        }

        let html = `
          <div class="post">
            ${content}
            <div class="meta">
              ${meta}
            </div>
          </div>
        `

        if(content !== undefined) {
          messageHandler(html)
        }

      });

    }

  }


  stopStreams() {

    for(let i in this.streams) {

      let stream = this.streams[i]

      let result = stream.stop() // TODO:only stop, if not selected in (now new) config

      console.log('Stopped stream', stream.requestOptions.url)

    }
    this.streams = []
  }

}
