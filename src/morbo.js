if (!process.env.token) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}

module.exports = {
    post_message: post_message,
    get_interval: get_interval
}

var Botkit = require('../lib/Botkit.js')
var os = require('os')
var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')

var interval;

var controller = Botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/morbo.v2/DataPersistence'
})

var bot = controller.spawn({
    token: process.env.token
}).startRTM()

controller.storage.channels.get(consts.nanAlertChannelId, function(err, json) { 
    interval = (json !== undefined && json.data.interval !== undefined) ? json.data.interval : 7
})

controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
    parse_channel_history()
})

controller.hears(['set days (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var value = parseInt(message.match[1])
    if (isNaN(value)) {
        bot.reply(message, 'Morbo will punish little humans for this! Insulting to Morbo to think ' + message.match[1] + ' is a number!')
        return
    }

    var days = isNaN(value) ? 7 : value
    controller.storage.channels.save({id: consts.nan_alert_channel_id, data: { interval:days }}, function(err) {
        if (err) {
            console.log(err)
        }
    })
    interval = days
    bot.reply(message, 'Morbo bows to your superior intellect. This time vermin!')
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
    var week_ago_in_milli = (now.setDate(now.getDate() - interval)) / 1000
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

function get_interval() {
    return interval
}
