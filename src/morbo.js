module.exports = {
    postMessage: postMessage
}

var botkit = require('../lib/Botkit.js')
var os = require('os')
var commands = require('./commands.js')
var data = require('./data.js')
var slackConfig = require('../slack.config.json')

var controller = botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/morbo.v2/DataPersistence'
})

var bot = controller.spawn({
    token: slackConfig.apiToken
}).startRTM()

data.load(controller.storage.channels)
commands.initialize(controller, bot)

function postMessage(message) {
    bot.api.chat.postMessage(message, function(err, res) {
        if (err) {
            console.log(err)
        }
    })
}
