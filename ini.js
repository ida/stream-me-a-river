const backendConfigFilePath = 'backend/data/config.json'

const config = require('./backend/config')
const main = require('./main').main

config.ini( backendConfigFilePath, main )
