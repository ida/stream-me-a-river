const filesystem = require('./helpers/filesystem')
const Doc = require('./templata/doc').Doc



function compareSources(config, credentials) {
// If a source of credentials is not found in sources of config,
// add it to config with default-values.

  let configChanged = false

  const defaultSourceConfig = {

    "streamTypes":  {

      "home": {
        "value": "user",
        "title": "Home",
        "checked": false
      },

      "local": {
        "value": "public/local",
        "title": "Local",
        "checked": true
      },

      "global": {
        "value": "public",
        "title": "Global",
        "checked": false
      }
    }
  }

  for(sourceName in credentials) {

    // Get source-name by convention from URL minus protocol:
    let protocol = ''
    if(sourceName.startsWith('http://')) protocol = 'http://'
    if(sourceName.startsWith('https://')) protocol = 'https://'
    sourceName = sourceName.slice(protocol.length)

    // Source doesn't have an entry in config:
    if(config.sources[sourceName] === undefined) {
      configChanged = true
      // Add entry with default-values:
      config.sources[sourceName] = defaultSourceConfig
    }

  }


  return config, configChanged

}



function getCredentialsOfSecretFile(secretFilePath) {
//
// Extract content wihthin brackets, return as JSON-object.
//
// Expects file to contain this format:
//
//    CREDS='{ 
//      "some.source": "someToken",
//      "another.source": "anotherToken"
//    }'
//
  let string = filesystem.readFile(secretFilePath)
	string = string.trim()
	string = string.slice(7, string.length-1)
  return JSON.parse(string)
}


function writeConfigFile(config) {
  filesystem.writeFile(config.paths.data.sources, JSON.stringify(config))
}


function writeConfigForm(config) {

  // Create document:
  let doc = new Doc(config.paths.forms.sources)

  // Add form to body:
  let form = doc.body.addTag('form', {action: '/sources', method:'post'})


  // Add fieldsets to form:
  for(let sourceName in config.sources) {

    let fields = config.sources[sourceName].streamTypes

    let fieldset = form.addTag('fieldset')

    fieldset.addTag('label', {}, sourceName)


    // Add fields to fieldset:
    for(let fieldName in fields) {

      let attr = fields[fieldName]

      attr.name = sourceName + '.' + fieldName

      let content = fieldName[0].toUpperCase() + fieldName.slice(1)

      fieldset.addField('multiselect', attr, content)
    }
  }

  // Add confirm-button:
  form.addTag('input', { type: 'submit', value: 'Send'})


  doc.writeRenderedHtml()

}


function writeSendForm(config) {

  // Create document:
  let doc = new Doc(config.paths.forms.send)

  // Add form to body:
  let form = doc.body.addTag('form', {action: '/send', method:'post'})

  form.addTag( 'label', {}, 'Write a message' )
  form.addField( 'textlines', { name: 'message' } )

  let fieldset = form.addTag('fieldset')
  fieldset.addTag('label', {}, 'Choose recipients')

  for(let sourceName in config.sources) {

    fieldset.addField('multiselect', { name: sourceName }, sourceName)

  }

  // Add confirm-button:
  form.addTag('input', { type: 'submit', value: 'Send'})

  doc.writeRenderedHtml()
}


function ini(paths, callback) {
  // Check, if sources of config-file differ with those in secret-file.
  // If so, update config-object and (re)-write config-file and -form.
  // Pass config-object and credentials-object of secret-file to callback.


  // Set default config for the case config-file does not exist:
  let config = { paths: paths, sources: {} }
  let configChanged = false
  let credentials = getCredentialsOfSecretFile(paths.secret)


  // Read and set config of config-file for the case config-file exists:
  if(filesystem.fileExists(paths.data.sources)) {
    config = filesystem.readObjectOfFile(paths.data.sources)
  }


  // Update config, if backend-user (re-)edited credentials in secret-file:
  config, configChanged = compareSources(config, credentials)

  // Write config-form for browser-user-input, if necessary:
  if(filesystem.fileExists(paths.forms.config) === false || configChanged === true) {
    writeConfigForm(config)
  }


  // Write config-file for permanent storage, if necessary:
  if(filesystem.fileExists(paths.data.sources) === false || configChanged === true) {
    writeConfigFile(config)
  }


  if(filesystem.fileExists(paths.forms.send) === false) {
    writeSendForm(config)
  }


  callback(credentials, config)

}


exports.ini = ini
exports.writeConfigFile = writeConfigFile
exports.writeConfigForm = writeConfigForm
