if (!process.env.token) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}

module.exports = {
    getChannelHistory: getChannelHistory
}

var Botkit = require('./lib/Botkit.js')
var os = require('os')

var controller = Botkit.slackbot({
    stats_output: true
})

var bot = controller.spawn({
    token: process.env.token
}).startRTM()

controller.hears(['hello'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'hello')
})