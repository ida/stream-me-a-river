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


module.exports.fileExists = fileExists
module.exports.readFile = readFile
module.exports.readObjectOfFile = readObjectOfFile
module.exports.writeFile = writeFile
module.exports.writeObjectToFile = writeObjectToFile
