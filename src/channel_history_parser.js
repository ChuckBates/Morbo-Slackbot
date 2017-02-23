module.exports = {
    parse: parse,
    extractCodeBlock: extractCodeBlock
}

function parse(messages) {
    var result = []
    if (messages !== undefined) {
        messages.forEach(function(message) {
            if (message.subtype === 'bot_message' && message.attachments !== undefined) {
                if (message.attachments[0] !== undefined && message.attachments[0].text !== undefined) {
                    result.push(message)
                }            
            }
        }, this);
    }
    
    return result;
}

function extractCodeBlock(attachmentText) {
    if (attachmentText === undefined || attachmentText === '') {
        return ''
    }

    var startIndex = attachmentText.indexOf('```', 0) 
    var endIndex = attachmentText.lastIndexOf('```')
    if (startIndex < 0) {
        return ''
    }

    var codeBlock = attachmentText.substring(startIndex + 3, endIndex)
    if (codeBlock !== undefined) {
        return codeBlock
    }
    return ''
}