var channel_history_parser = require('./channel_history_parser.js')
var consts = require('./consts.js')

exports.initialize = function (controller, bot) {    
    setInterval(function() {get_channel_history_if_time(bot)}, 60000)
    listen_for_count(controller)
}

var default_interval = 7;
var default_hour = 9;
var default_minute = 15;

function parse_channel_history(bot) {
    var now = new Date()
    var now_in_milli = (now.getTime())/1000
    var week_ago_in_milli = (now.setDate(now.getDate() - default_interval)) / 1000
    bot.api.channels.history({channel: consts.nan_alert_channel_id, latest: now_in_milli, oldest: week_ago_in_milli}, function (err, res) {        
        channel_history_parser.execute(res.messages)
    })
}

function get_channel_history_if_time(bot) {
    return function () {
        var now = new Date()
        if (now.getHours() === default_hour && now.getMinutes() === default_minute && now.getDay() !== 'Sunday' && now.getDay !== 'Saturday') {
            parse_channel_history(bot)
        }
    }
}

function listen_for_count(controller) {
    controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
        parse_channel_history(bot)
    })
}
