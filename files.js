var fs = require('fs');


function onError(error) {
  return console.log(error)
}


function writeFile(path, content='', callback=null) {

  fs.writeFile(path, content, function(err) {

      if(err) onError()

      if(callback !== null) callback()

      console.debug("\nFile '" + path + "' was saved.")

  });

}


function readFile(path, callback) {
	fs.readFile(path, 'utf-8', (err, data) => {
		if(err) throw err
		callback(data)
	});
}


module.exports.write = writeFile
module.exports.read = readFile
module.exports.writeFile = writeFile
module.exports.readFile = readFile
