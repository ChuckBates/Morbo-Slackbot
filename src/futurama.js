var botkit = require('../lib/Botkit.js')
var commands = require('./commands.js')
var data = require('./data.js')
var listener = require('./listener')
var slackConfig = require('../slack.config.json')

var controller = botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/futurama/DataPersistence'
})

var bot = controller.spawn({
    token: slackConfig.apiToken
}).startRTM()

data.load(controller.storage.channels)
commands.initialize(controller, bot)
listener.start()
