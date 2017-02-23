"use strict";

const assert = require('assert')
const channel_history_parser = require('../src/channel_history_parser')

describe('channel_history_parser', function () {
    describe('parse', function () {
        let test_parse = (messages, expected) => {
            it('should return ' + expected + ' when given ' + messages, () => {
                let result = channel_history_parser.parse(messages)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_parse(undefined, [])
            test_parse([], [])
            test_parse([{}, {}, {}], [])
        })

        describe('test is bot-posted', () => {
            let expected = { text: '', type: 'message', subtype: 'bot_message', attachments: [{ text: '' }] }
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                expected,
                {}
            ]
            test_parse(messages, [expected])
        })

        describe('test has attachment text', () => {
            let expected = { text: '', type: 'message', subtype: 'bot_message', attachments: [{ text: '' }] }
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                expected,
                { text: '', type: 'message', subtype: 'bot_message' }
            ]
            test_parse(messages, [expected])
        })

        describe('test has attachement text and is bot posted', () => {
            let expected = { text: '', type: 'message', subtype: 'bot_message', attachments: [{ text: '' }] }
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                expected,
                { text: '', type: 'message', subtype: 'bot_message', attachments: [] }
            ]
            test_parse(messages, [expected])
        })
    })

    describe('extractCodeBlock', function () {
        let test_extract_code_block = (attachement_text, expected) => {
            it('should return ' + expected + ' when given ' + attachement_text, () => {
                let result = channel_history_parser.extractCodeBlock(attachement_text)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract_code_block(undefined, '')
            test_extract_code_block('', '')
            test_extract_code_block('asdf 123 zxcv', '')
        })

        describe('test has code block', () => {
            let expected = 'finde me'
            let attachement_text = 'asdf ```' + expected + '``` zxcv'
            test_extract_code_block(attachement_text, expected)
        })
    })

    describe('extractHeadersAndStack', function () {
        let test_extract_headers_and_stack = (code_string, expected) => {
            it('should return ' + expected + ' when given ' + code_string, () => {
                let result = channel_history_parser.extractHeadersAndStack(code_string)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract_headers_and_stack(undefined, [])
            test_extract_headers_and_stack('', [])
            test_extract_headers_and_stack('asdf 123 zxcv', [])
        })

        describe('test extracting headers and stack', () => {
            let codeString = '[asdf] test'
            let expected = [{ timestamp: 'asdf', logLevel: '', codeClass: '', project: '', stack: '' }]
            test_extract_headers_and_stack(codeString, expected)

            codeString = '[asdf] [test] '
            expected = [{ timestamp: 'asdf', logLevel: 'test', codeClass: '', project: '', stack: '' }]
            test_extract_headers_and_stack(codeString, expected)

            codeString = '[asdf] [test] [zxcv] '
            expected = [{ timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: '', stack: '' }]
            test_extract_headers_and_stack(codeString, expected)

            codeString = '[asdf] [test] [zxcv] [qwerty] '
            expected = [{ timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: '' }]
            test_extract_headers_and_stack(codeString, expected)

            codeString = '[asdf] [test] [zxcv] [qwerty] 123'
            expected = [{ timestamp: 'asdf', logLevel: 'test', codeClass: 'zxcv', project: 'qwerty', stack: '123' }]
            test_extract_headers_and_stack(codeString, expected)
        })
    })
});