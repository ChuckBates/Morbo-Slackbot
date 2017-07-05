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
                attachments: [
                    {
                        fallback: message.attachments[0].fallback,
                        title: message.attachments[0].title,
                        title_link: message.attachments[0].title_link,
                        text: message.attachments[0].text,
                        color: message.attachments[0].color,
                        fields: [
                            {
                                title: message.attachments[0].fields[0].title,
                                value: message.attachments[0].fields[0].value,
                                short: message.attachments[0].fields[0].short
                            },
                            {
                                title: message.attachments[0].fields[1].title,
                                value: message.attachments[0].fields[1].value,
                                short: message.attachments[0].fields[1].short
                            }
                        ]
                    }
                ]
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

function handleTeamCityMessage(message) {
    if (message.attachments != undefined && message.attachments.length != 0) {
        return {
            slackMessage: { 
                channel: consts.botTestingChannelId, 
                username: 'Professor',
                as_user: false,
                icon_emoji: ':good-news:',
                text: 'Good news everyone!',
                attachments: [
                    {
                        fallback: message.attachments[0].fallback,
                        title: message.attachments[0].title,
                        title_link: message.attachments[0].title_link,
                        text: message.attachments[0].text,
                        color: message.attachments[0].color,
                        fields: [
                            {
                                title: message.attachments[0].fields[0].title,
                                value: message.attachments[0].fields[0].value,
                                short: message.attachments[0].fields[0].short
                            },
                            {
                                title: message.attachments[0].fields[1].title,
                                value: message.attachments[0].fields[1].value,
                                short: message.attachments[0].fields[1].short
                            }
                        ]
                    }
                ]
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
