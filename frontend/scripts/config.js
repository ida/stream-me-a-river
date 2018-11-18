const configJsonFilePath = '/data/config.json'

// After elements loaded, load configJsonFile, read selected fileds of it
// and select fields accordingly.

document.addEventListener('DOMContentLoaded', function() {

  function doAfterConfigLoaded(configAsJsonString) {

    let field = null

    const form = document.getElementsByTagName('form')[0]

    // Get streamTypes of config:
    let config = JSON.parse(configAsJsonString)

    // Deselect all fields: 
    for(let i=0; i < form.elements.length; i++) {
      field = form.elements[i]
      if(field.type == 'checkbox') {
        field.checked = false
      }
    }
      
    // Select fields according to config:
    for(let fieldName in config) {
      let streamType = config[fieldName]
      field = document.getElementsByName(fieldName)[0]
      field.checked = true
    }
  }


  // Load config:
  loadJson(configJsonFilePath, doAfterConfigLoaded)


});
