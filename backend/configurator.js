const filesystem = require('fs')

function fileExists(filePath) {
  return filesystem.existsSync(filePath)
}
function readFile(filePath) {
  return filesystem.readFileSync(filePath, 'utf-8')
}
function readObjectOfFile(filePath) {
  let content = filesystem.readFileSync(filePath, 'utf-8')
  let object = JSON.parse(content)
  return object
}
function writeFile(filePath, string) {
  filesystem.writeFileSync(filePath, string)
  console.log('Wrote', filePath)
}
function writeObjectToFile(filePath, object) {
  writeFile(JSON.stringify(object))
}




function compareSources(config, credentials) {
// If a source of credentials is not found in sources of config,
// add it to config with default-values.

  let configChanged = false

  const defaultSourceConfig = {

    "streamTypes":  {

      "home": {
        "value": "user",
        "title": "Home",
        "selected": false
      },

      "local": {
        "value": "public/local",
        "title": "Local",
        "selected": true
      },

      "global": {
        "value": "public",
        "title": "Global",
        "selected": false
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


function genConfigHtml(config) {
  let sources = config.sources
  let html = ``
  html += '<link rel="stylesheet" href="../styles/style.css">'
  html += '<script src="../scripts/helpers/load.js"></script>'
  html += '<script src="../scripts/config.js"></script>'
  html += '<label>'
  html += 'Select streams'
  html += '</label>'
  html += '<form action="/config" method="post">'
  for(let sourceName in sources) {
    html += genSourceHtml(sourceName, sources)
  }
  html += '<input type="submit" value="Save"></form>'
  return html
}


function genSourceHtml(sourceName, sources) {
  let html = '<fieldset>'
  html += '<label>'
  html += sourceName
  html += '</label>'
  let source = sources[sourceName]
  let streamTypes = source.streamTypes
  for(let streamTypeName in streamTypes) {
    let streamTypeObj = streamTypes[streamTypeName]
    html += `
<div class="field">
<input name="${sourceName}.${streamTypeName}"
       type="checkbox"
       value="${streamTypeObj.value}"`
       if(streamTypeObj.selected === true) {
         html += `
       checked`
       }
       html += `>
  ${streamTypeObj.title}
</div>`
  }
  html += '</fieldset>'
  return html
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
  let string = readFile(secretFilePath)
	string = string.trim()
	string = string.slice(7, string.length-1)
  return JSON.parse(string)
}


function writeConfigFile(config) {
  writeFile(config.paths.data.backend, JSON.stringify(config))
}


function ini(paths, callback) {
  // Check, if sources of config-file differ with those in secret-file.
  // If so, update config-object and (re)-write config-file and -form.
  // Pass config-object and credentials-object of secret-file to callback.


  // Set default config for the case config-file does not exist:
  let config = { paths: paths, sources: {} }
  let credentials = getCredentialsOfSecretFile(config.paths.secret)
  let configChanged = false


  // Read and set config of config-file for the case config-file exists:
  if(fileExists(config.paths.data.backend)) {
    config = readObjectOfFile(config.paths.data.backend)
  }


  // Update config, if backend-user (re-)edited credentials in secret-file:
  config, configChanged = compareSources(config, credentials)


  // Write config-form for browser-user-input, if necessary:
  if(fileExists(config.paths.form) === false || configChanged === true) {
    writeFile(config.paths.form, genConfigHtml(config))
  }

  // Write config-file for permanent storage, if necessary:
  if(fileExists(config.paths.data.backend) === false || configChanged === true) {
    writeConfigFile(config)
  }


  callback(credentials, config)

}


exports.ini = ini
exports.writeConfig = writeConfigFile
