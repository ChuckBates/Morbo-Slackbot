"use strict";

const assert = require('assert')
const consts = require('../src/consts')
const channelHistoryParser = require('../src/channelHistoryParser')

describe('channelHistoryParser', function () {
    describe('parse', function () {
        let testParse = (messages, expected) => {
            it('should return ' + expected + ' when given ' + JSON.stringify(messages), () => {
                let result = channelHistoryParser.parse(messages)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testParse(undefined, [])
            testParse([], [])
            testParse([{}, {}, {}], [])
        })

        describe('test is bot-posted', () => {
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: expected }]},
                {}
            ]
            testParse(messages, [expected])
        })

        describe('test has attachment text', () => {
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: expected }] },
                { text: '', type: 'message', subtype: 'bot_message' }
            ]
            testParse(messages, [expected])
        })

        describe('test has attachement text and is bot posted', () => {
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: expected }] },
                { text: '', type: 'message', subtype: 'bot_message', attachments: [] }
            ]
            testParse(messages, [expected])
        })

        describe('test has multiple valid messages', () => {
            let expected = ['attachement_text', 'other_attachment_text']
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: 'attachement_text' }] },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: 'other_attachment_text' }] }
            ]
            testParse(messages, expected)
        })

        describe('test posted by esAlertBot', () => {
            let expected = 'attachment_text'
            let messages = [
                { text: '', type: 'message', subtype: 'bot_message', bot_id: 'not_correct_id', attachments: [{ text: 'other_attachnemt_text' }] },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.esAlertBotId, attachments: [{ text: expected }] }
            ]
            testParse(messages, [expected])
        })
    })

    describe('extractCodeBock', function () {
        let testExtractCodeBlock = (attachementText, expected) => {
            it('should return ' + expected + ' when given ' + attachementText, () => {
                let result = channelHistoryParser.extractCodeBlock(attachementText)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testExtractCodeBlock(undefined, '')
            testExtractCodeBlock('', '')
            testExtractCodeBlock('asdf 123 zxcv', '')
        })

        describe('test has code block', () => {
            let expected = 'finde me'
            let attachementText = 'asdf ```' + expected + '``` zxcv'
            testExtractCodeBlock(attachementText, expected)
        })
    })

    describe('extractHeadersAndStack', function () {
        let testExtractHeadersAndStack = (codeDtring, expected) => {
            it('should return ' + JSON.stringify(expected) + ' when given ' + codeDtring, () => {
                let result = channelHistoryParser.extractHeadersAndStack(codeDtring)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testExtractHeadersAndStack(undefined, [])
            testExtractHeadersAndStack('', [])
            testExtractHeadersAndStack('asdf 123 zxcv', [])
        })

        describe('test extracting headers and stack', () => {
            let codeSring = '[asdf] test'
            let expected = { timestamp: 'asdf', logLevel: '', codeClass: '', project: '', stack: '' }
            testExtractHeadersAndStack(codeSring, expected)

            codeSring = '[asdf] [test] '
            expected = { timestamp: 'asdf', logLevel: 'test', codeClass: '', project: '', stack: '' }
            testExtractHeadersAndStack(codeSring, expected)

            codeSring = '[asdf] [test] [zxcv] '
            expected = { timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: '', stack: '' }
            testExtractHeadersAndStack(codeSring, expected)

            codeSring = '[asdf] [test] [zxcv] [qwerty] '
            expected = { timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: '' }
            testExtractHeadersAndStack(codeSring, expected)

            codeSring = '[asdf] [test] [zxcv] [qwerty] 123'
            expected = { timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: '123' }
            testExtractHeadersAndStack(codeSring, expected)
        })
    })
});
