var channelHistoryParser = require('./channelHistoryParser')
var consts = require('./consts')
var data = require('./data')

var days = 0
var hour = 0
var minute = 0
var bot

exports.initialize = function (controller, slackBot) {  
    setInterval(function() {getChannelHistoryIfTime(slackBot)}, 60000)
    listenForCount(controller)
    listenForSetDays(controller)
    listenForSetTime(controller)
    initializeTime()

    bot = slackBot
}

exports.postMessage = function(message) {
    bot.api.chat.postMessage(message, function(err, res) {
        if (err) {
            console.log(err)
        }
    })
}

function initializeTime() {
    days = consts.getDays()
    hour = consts.getHour()
    minute = consts.getMinute()
}

function parseChannelHistory(bot) {
    var now = new Date()
    var nowInMilli = (now.getTime())/1000
    var weekAgoInMilli = (now.setDate(now.getDate() - days)) / 1000
    bot.api.channels.history({channel: consts.nanAlertChannelId, latest: nowInMilli, oldest: weekAgoInMilli}, function (err, res) {        
        channelHistoryParser.execute(res.messages)
    })
}

function getChannelHistoryIfTime(bot) {
    return function () {
        var now = new Date()
        if (now.getHours() === hour && now.getMinutes() === minute && now.getDay() !== 'Sunday' && now.getDay !== 'Saturday') {
            parseChannelHistory(bot)
        }
    }
}

function listenForCount(controller) {
    controller.hears(['count'], 'direct_message,direct_mention,mention', function(bot, message) {    
        parseChannelHistory(bot)
    })
}

function listenForSetDays(controller) {
    controller.hears(['set days (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
        setDays(controller, bot, message)
    })
}

function listenForSetTime(controller) {
    controller.hears(['set time (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
        setTime(controller, bot, message)
    })
}

function setTime(controller, bot, message) {
    var value = message.match[1];
    if (!value.includes(':')) {
        bot.reply(message, 'Morbo demands correct format! Tiny humans can\'t do simple correct HH:mm.')
        return
    }

    var values = value.split(':')
    var newHour = parseInt(values[0])
    if (!data.checkValidNumber(bot, message, newHour)) {
        return
    }
    
    var newMinute = parseInt(values[1])
    if (!data.checkValidNumber(bot, message, newMinute)) {
        return
    }
    
    if (newHour < 1 || newHour > 24 || newMinute < 0 || newMinute > 60) {
        bot.reply(message, 'Morbo laughs at your puny time skills human vermin, Muahahahaha!')
        return
    }

    controller.storage.channels.get(consts.nanAlertChannelId, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nanAlertChannelId, 
                data: data.getDataToSave(json, '', newHour, newMinute)
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })

    hour = newHour
    consts.setHour(newHour)
    minute = newMinute
    consts.setMinute(newMinute)

    bot.reply(message, 'Morbo cares not about small human numbers with invasion soon, will set to pacify the vermin!')
}

function setDays(controller, bot, message) {
    var newDays = parseInt(message.match[1])
    if (!data.checkValidNumber(bot, message, newDays)) {
        return
    }

    controller.storage.channels.get(consts.nanAlertChannelId, function(err, json) {
        controller.storage.channels.save(
            {
                id: consts.nanAlertChannelId, 
                data: data.getDataToSave(json, newDays, '', '')
            }, function(err) {
                if (err) {
                    console.log(err)
                }     
            }
        )
    })
    days = newDays
    consts.setDays(newDays)

    bot.reply(message, 'Morbo bows to your superior intellect. This time vermin!')
}
