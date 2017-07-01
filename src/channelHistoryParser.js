module.exports = {
    execute: execute,
    parse: parse,
    extractCodeBlock: extractCodeBlock,
    extractHeadersAndStack: extractHeadersAndStack
}

var stackParser = require('./stackParser')
var distinctErrorAggregator = require('./distinctErrorAggregator')
var plotlyPlotter = require('./plotlyPlotter')
var listCleaner = require('./ListCleaner')
const consts = require('./consts')

function execute(messages) {
    var parsedMessages = parse(messages)
    var headerAndStackList = []
    parsedMessages.forEach(function(parsedMessage) {
        var codeBlock = extractCodeBlock(parsedMessage)
        var headerAndStack = extractHeadersAndStack(codeBlock)
        headerAndStack.stack = stackParser.parse(headerAndStack.stack)
        headerAndStackList.push(headerAndStack)
    }, this)

    var distinctList = distinctErrorAggregator.aggregateDistinctErrors(headerAndStackList)
    plotlyPlotter.preparePlot(listCleaner.clean(distinctList))
}

function parse(messages) {
    var result = []
    if (messages !== undefined) {
        messages.forEach(function(message) {
            if (isEsAlertBotPosted(message) && isAttachmentTextAvailable(message)) {
                    result.push(message.attachments[0].text)
            }
        }, this)
    }
    return result
}

function isEsAlertBotPosted(message) {
    return message.subtype === 'bot_message' && message.bot_id === consts.esAlertBotId
}

function isAttachmentTextAvailable(message) {
    return message.attachments !== undefined && message.attachments[0] !== undefined && message.attachments[0].text != undefined
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

function extractHeadersAndStack(codeBlock) {
    if (codeBlock === undefined || codeBlock === '') {
        return []
    }

    var index = codeBlock.indexOf('[')
    if (index < 0) {
        return []
    }

    var timestamp
    var logLevel
    var codeClass
    var project

    for (var i = 0; i < 4; i++) {
        codeBlock = codeBlock.trim()
        var indexOfFirstBracket = codeBlock.indexOf('[')
        var header = codeBlock.substring(indexOfFirstBracket + 1, codeBlock.indexOf(']', indexOfFirstBracket))
        switch (i) {
            case 0:
                timestamp = header
                break
            case 1:
                logLevel = header
                break
            case 2:
                codeClass = header
                break
            case 3: 
                project = header
                break
        }

        codeBlock = codeBlock.substring(header.length + 2)        
    }

    return {
        timestamp: timestamp, 
        logLevel: logLevel, 
        codeClass: codeClass, 
        project: project, 
        stack: codeBlock.trim()
    }
}
