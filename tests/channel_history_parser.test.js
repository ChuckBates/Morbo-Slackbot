"use strict";

const assert = require('assert')
const channel_history_parser = require('../src/channel_history_parser')

describe('channel_history_parser', function() {
    describe('getChannelHistory', function() {
        it('should return an empty array when given an empty array', () => {
            let messages = []
            let result = channel_history_parser.parse(messages)

            assert.equal(result.values, messages.values)
        })

        it('should not return errors for empty messages', () => {
            let messages = [{}, {}, {}]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 0)
        })

        it('should not return errors for messages that are not bot-posted', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })

        it('should not return errors for messages that do not have attachments', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {text: '', type: 'message', subtype: 'bot_message'}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })

        it('should return errors for messages that have attachment text', () => {
            let messages = [
                {text: '', type: 'message', subtype: 'not_bot_message'}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: [{text: ''}]}, 
                {text: '', type: 'message', subtype: 'bot_message', attachments: []}
            ]
            let result = channel_history_parser.parse(messages)

            assert.equal(result.length, 1)
        })
    })    
});
