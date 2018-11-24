const filesystem = require('fs')


function createDirectory(path) {
  if(filesystem.existsSync(path) === false) {
    filesystem.mkdirSync(path);
  }
}
function createDirectories(paths) {
  let path = ''
  for(let i in paths) {
    if(i != 0) path += '/'
    path += paths[i]
    createDirectory(path)
  }
}
function createParents(filePath) {
  let parentPath = filePath.split('/')
  parentPath = parentPath.slice(0, parentPath.length-1)
  createDirectories(parentPath)
}
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
  createParents(filePath)
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
  let html = `<html lang="en-gb">
  <head>
    <title>River config</title>
    <meta name="description"
          content="Congigure the streams of several mastodon-accounts.">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../styles/style.css">
  </head>
  <body>
    <label>Select streams</label>
    <form action="/config" method="post">
`
  for(let sourceName in sources) {
    html += genSourceHtml(sourceName, sources)
  }
  html += `      <input type="submit" value="Save">
    </form>
  </body>
</html>`
  return html
}


function genSourceHtml(sourceName, sources) {
  let source = sources[sourceName]
  let streamTypes = source.streamTypes
  let html = `      <fieldset>
        <label>${sourceName}</label>`; for(let streamTypeName in streamTypes) {
        let streamTypeObj = streamTypes[streamTypeName]; html += `
        <div class="field">
          <input name="${sourceName}.${streamTypeName}"
                 type="checkbox"
                 value="${streamTypeObj.value}"`
                 if(streamTypeObj.selected === true) { html += `
                 checked` } html +=
                 `>
          ${streamTypeObj.title}
        </div>`} html += `
      </fieldset>
`
  return html
}


function genSendHtml(config) {
let html = `
<html lang="en-gb">
  <head>
    <title>Send message</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../styles/style.css">
  </head>
  <body>
    <form action="/send" method="post">
      <label>
        Write a message
      </label>
      <br>
        <textarea name="message">Test message</textarea>
      <br>
`

  for(let sourceName in config.sources) {
html += `<div class="field">
<input name="${sourceName}"
       type="checkbox"
       value="${sourceName}"
       checked>
  ${sourceName}
</div>
`

  }

html += `


      <input type="submit" value="Send">
    </form>
  </body>
</html>
`
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
  writeFile(config.paths.data.sources, JSON.stringify(config))
}

function writeConfigForm(config) {
  let html = genConfigHtml(config)
  writeFile(config.paths.forms.sources, html)
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
  if(fileExists(paths.data.sources)) {
    config=readObjectOfFile(paths.data.sources)
  }


  // Update config, if backend-user (re-)edited credentials in secret-file:
  config, configChanged = compareSources(config, credentials)

  // Write config-form for browser-user-input, if necessary:
  if(fileExists(paths.forms.config) === false || configChanged === true) {
    writeConfigForm(config)
  }


  // Write config-file for permanent storage, if necessary:
  if(fileExists(paths.data.sources) === false || configChanged === true) {
    writeConfigFile(config)
  }


  if(fileExists(paths.forms.send) === false) {
    writeFile(paths.forms.send, genSendHtml(config))
  }


  callback(credentials, config)

}


exports.ini = ini
exports.writeConfigFile = writeConfigFile
exports.writeConfigForm = writeConfigForm
