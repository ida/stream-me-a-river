const files = require('./helpers/files')

let config = null
let configFilePath = null

function setConfigObjectOfFileAndWriteConfigForm(configPath, callback) {
  configFilePath = configPath
  files.read(configFilePath, function(content) {
    config = JSON.parse(content)
    callback(config)
  })
}

function genConfigHtml() {
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
    if(sourceName != 'default') {
      html += genSourceHtml(sourceName, sources)
    }
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

function writeConfigFile() {
  files.write(configFilePath, JSON.stringify(config))
}


function writeConfigForm(configFormPath='frontend/templates/config.html') {
  files.write(configFormPath, genConfigHtml(config))
}



exports.ini = function(configFilePath, callback) {
  setConfigObjectOfFileAndWriteConfigForm(configFilePath, callback)
}


exports.getConfig = function() {
  return config
}


exports.updateConfig = function(newConfig) {
  config = newConfig
  writeConfigFile() // TODO: Only do this if config changed.
  writeConfigForm() // TODO: Only do this if sources in config changed.
}
