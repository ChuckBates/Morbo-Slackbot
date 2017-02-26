"use strict";

const assert = require('assert')
const consts = require('../src/consts')
const channel_history_parser = require('../src/channel_history_parser')

describe('channel_history_parser', function () {
    describe('parse', function () {
        let test_parse = (messages, expected) => {
            it('should return ' + expected + ' when given ' + JSON.stringify(messages), () => {
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
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: expected }]},
                {}
            ]
            test_parse(messages, [expected])
        })

        describe('test has attachment text', () => {
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: expected }] },
                { text: '', type: 'message', subtype: 'bot_message' }
            ]
            test_parse(messages, [expected])
        })

        describe('test has attachement text and is bot posted', () => {
            let expected = 'attachement_text'
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: expected }] },
                { text: '', type: 'message', subtype: 'bot_message', attachments: [] }
            ]
            test_parse(messages, [expected])
        })

        describe('test has multiple valid messages', () => {
            let expected = ['attachement_text', 'other_attachment_text']
            let messages = [
                { text: '', type: 'message', subtype: 'not_bot_message' },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: 'attachement_text' }] },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: 'other_attachment_text' }] }
            ]
            test_parse(messages, expected)
        })

        describe('test posted by es_alert_bot', () => {
            let expected = 'attachment_text'
            let messages = [
                { text: '', type: 'message', subtype: 'bot_message', bot_id: 'not_correct_id', attachments: [{ text: 'other_attachnemt_text' }] },
                { text: '', type: 'message', subtype: 'bot_message', bot_id: consts.es_alert_bot_id, attachments: [{ text: expected }] }
            ]
            test_parse(messages, [expected])
        })
    })

    describe('extract_code_block', function () {
        let test_extract_code_block = (attachement_text, expected) => {
            it('should return ' + expected + ' when given ' + attachement_text, () => {
                let result = channel_history_parser.extract_code_block(attachement_text)
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

    describe('extract_headers_and_stack', function () {
        let test_extract_headers_and_stack = (code_string, expected) => {
            it('should return ' + expected + ' when given ' + code_string, () => {
                let result = channel_history_parser.extract_headers_and_stack(code_string)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract_headers_and_stack(undefined, [])
            test_extract_headers_and_stack('', [])
            test_extract_headers_and_stack('asdf 123 zxcv', [])
        })

        describe('test extracting headers and stack', () => {
            let code_string = '[asdf] test'
            let expected = [{ timestamp: 'asdf', log_level: '', code_class: '', project: '', stack: '' }]
            test_extract_headers_and_stack(code_string, expected)

            code_string = '[asdf] [test] '
            expected = [{ timestamp: 'asdf', log_level: 'test', code_class: '', project: '', stack: '' }]
            test_extract_headers_and_stack(code_string, expected)

            code_string = '[asdf] [test] [zxcv] '
            expected = [{ timestamp: 'asdf', log_level: 'test', code_class: 'zxcv', project: '', stack: '' }]
            test_extract_headers_and_stack(code_string, expected)

            code_string = '[asdf] [test] [zxcv] [qwerty] '
            expected = [{ timestamp: 'asdf', log_level: 'test', code_class: 'zxcv', project: 'qwerty', stack: '' }]
            test_extract_headers_and_stack(code_string, expected)

            code_string = '[asdf] [test] [zxcv] [qwerty] 123'
            expected = [{ timestamp: 'asdf', log_level: 'test', code_class: 'zxcv', project: 'qwerty', stack: '123' }]
            test_extract_headers_and_stack(code_string, expected)
        })
    })
});
