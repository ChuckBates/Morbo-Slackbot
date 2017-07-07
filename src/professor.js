module.exports = {
    handleMessage: handleMessage
}

var consts = require('./consts')

function handleMessage(message) {
    if (message.attachments != undefined && message.attachments.length != 0) {
        return {
            slackMessage: { 
                channel: consts.botTestingChannelId, 
                username: 'Professor',
                as_user: false,
                icon_emoji: ':good-news:',
                text: 'Good news everyone!',
                attachments: message.attachments
            },
            code: 200,
            message: 'success'
        }        
    } else {
        return {
            slackMessage: [],
            code: 200, 
            message: 'okay'
        }
    }
}
