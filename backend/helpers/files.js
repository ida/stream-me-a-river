var fs = require('fs');


function copyFile(sourcePath, destinationPath) {

	fs.copyFile(sourcePath, destinationPath, (error) => {

		if(err) throw err

		console.log(`Copied ${sourcePath} to ${destinationPath}.`)

	});

}


function writeFile(path, content='', callback=null) {

  fs.writeFile(path, content, function(error) {

    if(error) throw error

    if(callback !== null) callback()

		console.log(`Wrote ${path}`)

  });

}


function readFile(path, callback, onError=null) {

	fs.readFile(path, 'utf-8', (err, data) => {

		if(err) {
      if(onError !== null) {
        onError(err)
      }
      else {
        throw err
      }
    }
    else {
		  callback(data)
    }

	});
}


module.exports.copy = copyFile
module.exports.read = readFile
module.exports.write = writeFile
