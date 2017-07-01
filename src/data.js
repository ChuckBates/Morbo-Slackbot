var consts = require('./consts')

module.exports = {
    checkValidNumber: checkValidNumber,
    getDataToSave: getDataToSave,
    load: load
}

function checkValidNumber(bot, message, value) {
    if (isNaN(value)) {
        bot.reply(message, 'Morbo will punish little humans for this! Insulting to Morbo to think ' + value + ' is a number!')
        return false
    }
    return true
}

function getDataToSave(json, newDays, newHour, newMinute) {
    var savedData = (json !== undefined && json.data !== undefined) ? json.data : {}
    savedData.interval = (newDays !== undefined && newDays !== '') ? newDays : consts.getDays()
    savedData.hour = (newHour !== undefined && newHour !== '') ? newHour : consts.getHour()
    savedData.minute = (newMinute !== undefined && newMinute !== '') ? newMinute : consts.getMinute()
    return savedData
}

function load(channels) {
    //TODO: This appears to have broken some time ago, figure out and fix
    channels.get(consts.nanAlertChannelId, function(err, json) { 
        if (json !== undefined && json.data.interval !== undefined) {
            consts.setDays(json.data.interval)
            consts.setHour(json.data.hour)
            consts.setMinute(json.data.minute)
        }
    })
}
