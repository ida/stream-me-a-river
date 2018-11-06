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

		console.log(`Saved ${path}.`)

  });

}


function readFile(path, callback) {

	fs.readFile(path, 'utf-8', (err, data) => {

		if(err) throw err

		callback(data)

	});
}


module.exports.copy = copyFile
module.exports.read = readFile
module.exports.write = writeFile
