module.exports = {
    parse: parse
}

function parse(messages) {
    var result = []
    messages.forEach(function(message) {
        if (message.subtype === 'bot_message' && message.attachments !== undefined) {
            if (message.attachments[0] !== undefined && message.attachments[0].text !== undefined) {
                result.push(message)
            }            
        }
    }, this);
    return result;
}