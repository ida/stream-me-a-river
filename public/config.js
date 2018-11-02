
document.addEventListener('DOMContentLoaded', function() {

  function doAfterConfigLoaded(configAsJsonString) {
    const form = document.getElementsByTagName('form')[0]
    // Deselect all fields: 
    // Get streamTypes of config:
    let config = JSON.parse(configAsJsonString)
console.log(config)
    let streamTypes = []
    for(let fieldName in config) {
      let streamType = config[fieldName]
    // Select fields according to config:
//      console.log()
        let field = document.getElementsByName(fieldName)[0]
        field.checked = true
      streamTypes.push(streamType)
    }
  }

  // Load config (loadJson is defined in public/load.js):
  loadJson('/config.json', doAfterConfigLoaded) 



});