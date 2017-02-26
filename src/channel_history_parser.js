module.exports = {
    parse: parse,
    extract_code_block: extract_code_block,
    extract_headers_and_stack: extract_headers_and_stack
}
const consts = require('../src/consts')

function parse(messages) {
    var result = []
    if (messages !== undefined) {
        messages.forEach(function(message) {
            if (is_es_alert_bot_posted(message) && is_attachment_text_available(message)) {
                    result.push(message.attachments[0].text)
            }
        }, this)
    }
    return result
}

function is_es_alert_bot_posted(message) {
    return message.subtype === 'bot_message' && message.bot_id === consts.es_alert_bot_id
}

function is_attachment_text_available(message) {
    return message.attachments !== undefined && message.attachments[0] !== undefined && message.attachments[0].text != undefined
}

function extract_code_block(attachment_text) {
    if (attachment_text === undefined || attachment_text === '') {
        return ''
    }

    var start_index = attachment_text.indexOf('```', 0) 
    var end_index = attachment_text.lastIndexOf('```')
    if (start_index < 0) {
        return ''
    }

    var code_block = attachment_text.substring(start_index + 3, end_index)
    if (code_block !== undefined) {
        return code_block
    }
    return ''
}

function extract_headers_and_stack(code_block) {
    if (code_block === undefined || code_block === '') {
        return []
    }

    var index = code_block.indexOf('[')
    if (index < 0) {
        return []
    }

    var timestamp
    var log_level
    var code_class
    var project

    for (var i = 0; i < 4; i++) {
        code_block = code_block.trim()
        var index_of_first_bracket = code_block.indexOf('[')
        var header = code_block.substring(index_of_first_bracket + 1, code_block.indexOf(']', index_of_first_bracket))
        switch (i) {
            case 0:
                timestamp = header
                break
            case 1:
                log_level = header
                break
            case 2:
                code_class = header
                break
            case 3: 
                project = header
                break
        }

        code_block = code_block.substring(header.length + 2)        
    }

    return {
        timestamp: timestamp, 
        log_level: log_level, 
        code_class: code_class, 
        project: project, 
        stack: code_block.trim()
    }
}
