module.exports = {
    post_message: post_message
}

var Botkit = require('../lib/Botkit.js')
var os = require('os')
var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')
var commands = require('./commands.js')

var controller = Botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/morbo.v2/DataPersistence'
})

var bot = controller.spawn({
    token: 'xoxb-142124192757-vCae3E93BkPHLojEYEQzjU5U'
}).startRTM()

//TODO: This appears to have broken some time ago, figure out and fix
controller.storage.channels.get(consts.nanAlertChannelId, function(err, json) { 
    if (json !== undefined && json.data.interval !== undefined) {
        consts.set_days(json.data.interval)
        consts.set_hour(json.data.hour)
        consts.set_minute(json.data.minute)
    }
})

commands.initialize(controller, bot)

function post_message(message) {
    bot.api.chat.postMessage(message, function(err, res) {
        if (err) {
            console.log(err)
        }
    })
}
