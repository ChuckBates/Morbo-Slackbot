var consts = require('./consts')

module.exports = {
    check_valid_number: check_valid_number,
    get_data_to_save: get_data_to_save
}

function check_valid_number(bot, message, value) {
    if (isNaN(value)) {
        bot.reply(message, 'Morbo will punish little humans for this! Insulting to Morbo to think ' + value + ' is a number!')
        return false
    }
    return true
}

function get_data_to_save(json, new_days, new_hour, new_minute) {
    var saved_data = (json !== undefined && json.data !== undefined) ? json.data : {}
    saved_data.interval = (new_days !== undefined && new_days !== '') ? new_days : consts.get_days()
    saved_data.hour = (new_hour !== undefined && new_hour !== '') ? new_hour : consts.get_hour()
    saved_data.minute = (new_minute !== undefined && new_minute !== '') ? new_minute : consts.get_minute()
    return saved_data
}
