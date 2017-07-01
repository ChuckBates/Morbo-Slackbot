module.exports = {
    getDays: getDays,
    getHour: getHour,
    getMinute: getMinute,
    setDays: setDays,
    setHour: setHour,
    setMinute: setMinute,
    nanAlertChannelId: 'C3CKXGJG4', 
    botTestingChannelId: 'G2FFZP1T4',
    esAlertBotId: 'B04HH385S'
}

var defaultDays = 7;
var defaultHour = 9;
var defaultMinute = 15;

function getDays() {
    return defaultDays
}

function getHour() {
    return defaultHour
}

function getMinute() {
    return defaultMinute
}

function setDays(days) {
    defaultDays = days
}

function setHour(hour) {
    defaultHour = hour
}

function setMinute(minute) {
    defaultMinute = minute
}
