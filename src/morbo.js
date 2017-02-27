if (!process.env.token) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}

module.exports = {
    post_message: post_message
}

var Botkit = require('../lib/Botkit.js')
var os = require('os')
var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')

var controller = Botkit.slackbot({
    stats_output: true
})

var bot = controller.spawn({
    token: process.env.token
}).startRTM()

controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
    parse_channel_history()
})

setInterval(function() {
    var now = new Date()
    if (now.getHours() === 9 && now.getMinutes() === 15 && now.getDay() !== 'Sunday' && now.getDay !== 'Saturday') {
        parse_channel_history()
    }
}, 60000)

function parse_channel_history() {
    var now = new Date()
    var now_in_milli = (now.getTime())/1000
    var week_ago_in_milli = (now.setDate(now.getDate() - 7)) / 1000
    bot.api.channels.history({channel: consts.nan_alert_channel_id, latest: now_in_milli, oldest: week_ago_in_milli}, function (err, res) {        
        channel_history_parser.execute(res.messages)
    })
}

function post_message(message) {
    bot.api.chat.postMessage(message, function(err, res) {
        if (err) {
            console.log(err)
        }
    })
}
