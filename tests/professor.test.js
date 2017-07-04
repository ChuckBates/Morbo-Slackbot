'use strict';

const assert = require('assert')
const professor = require('../src/professor')
const consts = require('../src/consts')

describe('professor', function() {
    describe('handleTeamCityMessage', function() {
        let testHandle = (message, expected) => {
            it('should return ' + JSON.stringify(expected) + ' when given message: ' + JSON.stringify(message), () => {
                let result = professor.handleTeamCityMessage(message)
                assert.deepEqual(result, expected)
            })
        }

        describe('when handling a team city message that is empty', () => {
            let message = {}
            let expected = {
                slackMessage: {},
                code: 200,
                message: 'okay'
            }
            testHandle(message, expected)
        })

        describe('when handling a failed/success team city message', () => {
            let message = messageMother()
            let expected = {
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
                    
                },
                code: 200,
                message: 'success'
            }
            testHandle(message, expected)
        })

        describe('when handling a team city message and there are no attachments', () => {
            let message = messageMother()
            message.attachments = []
            let expected = {
                slackMessage: [],
                code: 200, 
                message: 'okay'
                }
            testHandle(message, expected)
        })
    })
})

function messageMother() {
    return {
        attachments: [
            {
                title: 'Project built successfully',
                title_link: 'valid-link',
                text: 'valid-text',
                fallback: 'valid-fallback',
                color: "#00A652",
                fields: [
                    {
                        title: 'Build Version',
                        value: '1.0.0.34',
                        short: 'true'
                    }, 
                    {
                        title: 'Triggered by',
                        value: 'chuck-bates',
                        short: 'true'
                    }
                ]
            }                    
        ]
    }
}
