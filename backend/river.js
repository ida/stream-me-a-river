const configurator = require('./configurator')
const files = require('./helpers/files')
const Source = require('./source').Source


let messagesTotalAmount = 0

let messages = []


exports.River = class River {

  constructor(urlAccesstokenPairs, config) {
    this.config = config
    this.sources = []
    this.urlAccesstokenPairs = urlAccesstokenPairs
    this.startSources()
  }


  addMessage(message) {

    messagesTotalAmount += 1

    if(messagesTotalAmount == 1) {
      console.log('Got first message, everything seems to be fine :-)')
    }

    messages.push(message)
  }


  getMessages() {
    let currentMessages = messages
    messages = []
    return currentMessages
  }


  startSources() {

    messagesTotalAmount = 0

    let urlAccesstokenPairs = this.urlAccesstokenPairs

    for(let url in urlAccesstokenPairs) {

      let accessToken = urlAccesstokenPairs[url]
      let messageHandler = this.addMessage

			// Tolerance for passed URLs missing the protocol, default to https:
      if(url.startsWith('https://') === false
			|| url.startsWith('https://') === false ) {
				url = 'https://' + url
			}

			// Get source-name by convention from URL minus protocol:
			let sourceName = url
			let protocol = ''
			if(sourceName.startsWith('http://')) protocol = 'http://'
			if(sourceName.startsWith('https://')) protocol = 'https://'
			sourceName = sourceName.slice(protocol.length)


      // Get streamTypes of config:
      let streamTypesObj = this.config.sources[sourceName].streamTypes



      // Inititalize source:
      let apiUrl = url + '/api/v1/'
      let source = new Source(apiUrl,
                              accessToken,
                              streamTypesObj,
                              messageHandler);

      this.sources.push(source)
    }

  }


  updateConfig(config) {
    for(let i in this.sources) {
      this.sources[i].stopStreams()
    }
    this.config = config
    this.sources = []
    messages = []
    this.startSources()
    configurator.writeConfig(config)
  }


} // End of River
