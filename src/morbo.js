module.exports = {
    post_message: post_message,
    get_interval: get_interval,
    get_data_to_save: get_data_to_save,
    set_interval: set_interval,
    set_hour: set_hour,
    set_minute: set_minute
}

var Botkit = require('../lib/Botkit.js')
var os = require('os')
var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')

var default_interval = 7;
var default_hour = 9;
var default_minute = 15;

var controller = Botkit.slackbot({
    stats_output: true,
    json_file_store: 'C:/dev/SlackBots/morbo.v2/DataPersistence'
})

var bot = controller.spawn({
    token: 'xoxb-142124192757-vCae3E93BkPHLojEYEQzjU5U'
}).startRTM()

controller.storage.channels.get(consts.nanAlertChannelId, function(err, json) { 
    if (json !== undefined && json.data.interval !== undefined) {
        default_interval = json.data.interval
    }
})

controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
    parse_channel_history()
})

controller.hears(['set days (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var days = parseInt(message.match[1])
    if (isNaN(days)) {
        bot.reply(message, 'Morbo will punish little humans for this! Insulting to Morbo to think ' + message.match[1] + ' is a number!')
        return
    }

    controller.storage.channels.get(consts.nan_alert_channel_id, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nan_alert_channel_id, 
                data: get_data_to_save(json, days, '', '')
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })
    default_interval = days
    bot.reply(message, 'Morbo bows to your superior intellect. This time vermin!')
})

controller.hears(['set time (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var value = message.match[1];
    if (!value.includes(':')) {
        bot.reply(message, 'Morbo demands correct format! Tiny humans can\'t do simple correct HH:mm.')
        return
    }

    var values = value.split(':')
    var new_hour = parseInt(values[0])
    if (!check_valid_number(bot, new_hour)) {
        return
    }
    
    var new_minute = parseInt(values[1])
    if (!check_valid_number(bot, new_minute)) {
        return
    }
    
    if (default_hour < 1 || default_hour > 24 || default_minute < 0 || default_minute > 60) {
        bot.reply(message, 'Morbo laughs at your puny time skills human vermin, Muahahahaha!')
        return
    }

    controller.storage.channels.get(consts.nan_alert_channel_id, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nan_alert_channel_id, 
                data: get_data_to_save(json, '', new_hour, new_minute)
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })

    default_hour = new_hour
    default_minute = new_minute
    bot.reply(message, 'Morbo cares not about small human numbers with invasion soon, will set to pacify the vermin!')
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
    var week_ago_in_milli = (now.setDate(now.getDate() - default_interval)) / 1000
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

function check_valid_number(bot, value) {
    if (isNaN(value)) {
        bot.reply(message, 'Morbo will punish little humans for this! Insulting to Morbo to think ' + value + ' is a number!')
        return false
    }
    return true
}

function get_data_to_save(json, days, hour, minute) {
        var saved_data = (json !== undefined && json.data !== undefined) ? json.data : {}
        saved_data.interval = (days !== undefined && days !== '') ? days : default_interval
        saved_data.hour = (hour !== undefined && hour !== '') ? hour : default_hour
        saved_data.minute = (minute !== undefined && minute !== '') ? minute : default_minute
        return saved_data
}

function get_interval() {
    return default_interval
}

function set_interval(days) {
    default_interval = days
}

function set_hour(hour) {
    default_hour = hour
}

function set_minute(minute) {
    default_minute = minute
}
