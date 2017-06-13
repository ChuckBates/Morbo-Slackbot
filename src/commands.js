var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')
var data = require('./data.js')

var days = 0
var hour = 0
var minute = 0

exports.initialize = function (controller, bot) {  
    setInterval(function() {get_channel_history_if_time(bot)}, 60000)
    listen_for_count(controller)
    listen_for_set_days(controller)
    listen_for_set_time(controller)
    initialize_time()
}

function initialize_time() {
    days = consts.get_days()
    hour = consts.get_hour()
    minute = consts.get_minute()
}

function parse_channel_history(bot) {
    var now = new Date()
    var now_in_milli = (now.getTime())/1000
    var week_ago_in_milli = (now.setDate(now.getDate() - days)) / 1000
    bot.api.channels.history({channel: consts.nan_alert_channel_id, latest: now_in_milli, oldest: week_ago_in_milli}, function (err, res) {        
        channel_history_parser.execute(res.messages)
    })
}

function get_channel_history_if_time(bot) {
    return function () {
        var now = new Date()
        if (now.getHours() === hour && now.getMinutes() === minute && now.getDay() !== 'Sunday' && now.getDay !== 'Saturday') {
            parse_channel_history(bot)
        }
    }
}

function listen_for_count(controller) {
    controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
        parse_channel_history(bot)
    })
}

function listen_for_set_days(controller) {
    controller.hears(['set days (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
        set_days(controller, bot, message)
    })
}

function listen_for_set_time(controller) {
    controller.hears(['set time (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
        set_time(controller, bot, message)
    })
}

function set_time(controller, bot, message) {
    var value = message.match[1];
    if (!value.includes(':')) {
        bot.reply(message, 'Morbo demands correct format! Tiny humans can\'t do simple correct HH:mm.')
        return
    }

    var values = value.split(':')
    var new_hour = parseInt(values[0])
    if (!data.check_valid_number(bot, message, new_hour)) {
        return
    }
    
    var new_minute = parseInt(values[1])
    if (!data.check_valid_number(bot, message, new_minute)) {
        return
    }
    
    if (new_hour < 1 || new_hour > 24 || new_minute < 0 || new_minute > 60) {
        bot.reply(message, 'Morbo laughs at your puny time skills human vermin, Muahahahaha!')
        return
    }

    controller.storage.channels.get(consts.nan_alert_channel_id, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nan_alert_channel_id, 
                data: data.get_data_to_save(json, '', new_hour, new_minute)
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })

    hour = new_hour
    consts.set_hour(new_hour)
    minute = new_minute
    consts.set_minute(new_minute)

    bot.reply(message, 'Morbo cares not about small human numbers with invasion soon, will set to pacify the vermin!')
}

function set_days(controller, bot, message) {
    var new_days = parseInt(message.match[1])
    if (!data.check_valid_number(bot, message, new_days)) {
        return
    }

    controller.storage.channels.get(consts.nan_alert_channel_id, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nan_alert_channel_id, 
                data: data.get_data_to_save(json, new_days, '', '')
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })
    days = new_days
    consts.set_days(new_days)

    bot.reply(message, 'Morbo bows to your superior intellect. This time vermin!')
}
