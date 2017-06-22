module.exports = {
    post_message: post_message
}

var Botkit = require('../lib/Botkit.js')
var os = require('os')
var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')
var commands = require('./commands.js')
var data = require('./data.js')

var controller = Botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/morbo.v2/DataPersistence'
})

var bot = controller.spawn({
    token: 'xoxb-142124192757-vCae3E93BkPHLojEYEQzjU5U'
}).startRTM()

data.load(controller.storage.channels)
commands.initialize(controller, bot)

function post_message(message) {
    bot.api.chat.postMessage(message, function(err, res) {
        if (err) {
            console.log(err)
        }
    })
}
