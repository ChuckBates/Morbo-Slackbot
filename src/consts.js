module.exports = {
    get_days: get_days,
    get_hour: get_hour,
    get_minute: get_minute,
    set_days: set_days,
    set_hour: set_hour,
    set_minute: set_minute,
    nan_alert_channel_id: 'C3CKXGJG4', 
    bot_testing_channel_id: 'G2FFZP1T4',
    es_alert_bot_id: 'B04HH385S'
}

var default_days = 7;
var default_hour = 9;
var default_minute = 15;

function get_days() {
    return default_days
}

function get_hour() {
    return default_hour
}

function get_minute() {
    return default_minute
}

function set_days(days) {
    default_days = days
}

function set_hour(hour) {
    default_hour = hour
}

function set_minute(minute) {
    default_minute = minute
}
