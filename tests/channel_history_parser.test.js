"use strict";

const assert = require('assert')
const channel_history_parser = require('../src/channel_history_parser')

describe('channel_history_parser', function() {
    describe('parse', function() {
        it('should return an empty array when given undefined', () => {
            let messages = undefined
            let result = channel_history_parser.parse(messages)

            assert.deepEqual(result, [])
        })

        it('should return an empty array when given an empty array', () => {
            let messages = []
            let result = channel_history_parser.parse(messages)

            assert.deepEqual(result, messages)
        })

        it('should not return error strings for empty messages', () => {
            let messages = [{}, {}, {}]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 0)
        })

        it('should not return error strings for messages that are not bot-posted', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })

        it('should not return error strings for messages that do not have attachments', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {text: '', type: 'message', subtype: 'bot_message'}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })

        it('should return error strings for messages that have attachment text', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: []}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })
    })    

    describe('extractCodeBlock', function() {
        it('should return empty if undefined', () => {
            let attachmentText = undefined
            let result = channel_history_parser.extractCodeBlock(attachmentText)

            assert.equal(result, '')
        })

        it('should return empty if empty', () => {
            let attachmentText = ''
            let result = channel_history_parser.extractCodeBlock(attachmentText)

            assert.equal(result, '')
        })

        it('should return empty if no code block', () => {
            let attachmentText = 'asdf 123 zxcv'
            let result = channel_history_parser.extractCodeBlock(attachmentText)

            assert.equal(result, '')
        })

        it('should return contents of code block', () => {
            let testText = 'find_me'
            let attachmentText = 'asdf ```' + testText + '```zxcv'
            let result = channel_history_parser.extractCodeBlock(attachmentText)

            assert.equal(result, testText)
        })
    })

    describe('extractHeadersAndStack', function() {
        it('should return empty if undefined', () => {
            let codeString = undefined
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, [])
        })

        it('should return empty if empty', () => {
            let codeString = ''
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, [])
        })

        it('should return empty if no header brackets', () => {
            let codeString = 'asdf 123 zxcv'
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, [])
        })

        it('should contain the frist header', () => {
            let codeString = '[asdf] test'
            let expected = [{timestamp: 'asdf', logLevel:'', codeClass:'', project:'', stack: ''}]
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, expected)
        })

        it('should contain the second header', () => {
            let codeString = '[asdf] [test] '
            let expected = [{timestamp: 'asdf', logLevel: 'test', codeClass:'', project:'', stack: ''}]
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, expected)
        })

        it('should contain the third header', () => {
            let codeString = '[asdf] [test] [zxcv] '
            let expected = [{timestamp: 'asdf', logLevel: 'test', codeClass:'zxcv', project:'', stack: ''}]
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, expected)
        })

        it('should contain the fourth header', () => {
            let codeString = '[asdf] [test] [zxcv] [qwerty] '
            let expected = [{timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: ''}]
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, expected)
        })

        it('should contain the stack', () => {
            let codeString = '[asdf] [test] [zxcv] [qwerty] 123'
            let expected = [{timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: '123'}]
            let result = channel_history_parser.extractHeadersAndStack(codeString)

            assert.deepEqual(result, expected)
        })
    })
});


// "Alert: 1 errors detected in `IndSubscriptionUpdatedHandler Error` query in the last 15 minutes
// Hosts: `10.107.3.82 (IPW-REDEMPTION-USERACCOUNTS-1)`

// <https://kibana.pluralsight.com/kibana4/#/dashboard/Log4Net_Errors|Details>
// ```[2017-02-18 04:02:53,613] [ERROR] [PS.Services.UserAccountsNan.IndividualSubscriptionUpdatedHandler] [PS.UserAccountsServiceNan] User 19f67fb6-8d6d-4939-842c-73667aaa2646 has a corporate subscription. Subscriber ID: 151682```"