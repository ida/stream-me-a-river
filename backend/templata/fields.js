function addField(parentTag, typeName='textline', attr={}, content=[]) {

  // Define fieldTypes and default-arguments for them:
  let fieldTypeToTagArgsMap = {
    monoselect:  ['input',    { type: 'radio'    }, ''],
    multiselect: ['input',    { type: 'checkbox' }, ''],
    textline:    ['input',    {                  }, ''],
    textlines:   ['textarea', {                  }, '']
  }

  // Get default args for the chosen fieldType:
  let args = fieldTypeToTagArgsMap[typeName]
  // Add or overwrite passed attrs in args:
  for(let att in attr) args[1][att] = attr[att]
  // Set passed content in args, if not empty:
  if(content != []) args[2] = content

  // Create a wrapper-div:
  parentTag = parentTag.addTag('div', { 'class': 'field' } )
  // Create new tag with composed args in div:
  parentTag.addTag(...args)

}


function validateFieldArgs(args) {

  let tagName    = args[0]
  let attr       = args[1]
  let content    = args[2]

  if(tagName == 'input') {
    // A multi-select-field ...
    if(attr.type !== undefined && attr.type == 'checkbox') {
      // ... must have a name-attribute with non-empty value ...
      return attr.name !== undefined && String(attr.name) != ''
      // ... must have a value-attribute with non-empty value ...
          && attr.value !== undefined && String(attr.value) != ''
      // ... must have content with a non-empty string as value:
          && typeof(content) == 'string' && content != ''
    }
  }
}


exports.addField = addField
