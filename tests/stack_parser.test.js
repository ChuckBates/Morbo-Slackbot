"use strict";

const assert = require('assert')
const stack_parser = require('../src/stack_parser')

describe('stack_parser', function() {
    describe('extract_first_statement', function() {
        let test_extract = (stack, separator, expected) => {
            it('should return ' + expected + ' when given ' + stack + ' with separator ' + separator, () => {
                let result = stack_parser.extract_first_statement(stack, separator)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract(undefined, ':', '')
            test_extract('', ':', '')
        })

        describe('test separator not present', () => {
            test_extract('asdf', ':', '')
        })

        describe('test stack with multiple separators', () => {
            test_extract('Uncaught Exception:: what was that whole one in a million talk?', ':', 'Uncaught Exception')
        })

        describe('test valid stack', () => {
            test_extract('Uncaught Exception: patient zero has started to spread!', ':', 'Uncaught Exception')
        })
    })

    describe('remove_first_statement', function() {
        let test_remove = (stack, separator, expected) => {
            it('should return ' + expected + ' when given ' + stack + ' with separator ' + separator, () => {
                let result = stack_parser.remove_first_statement(stack, separator)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_remove(undefined, ':', '')
            test_remove('', ':', '')
        })

        describe('test separator not present', () => [
            test_remove('asdf zxcv', ':', '')
        ])

        describe('test stack with multiple separators', () => {
            test_remove('Uncaught Exception:: what was that whole one in a million talk?', ':', 'what was that whole one in a million talk?')
        })

        describe('test valid stack', () => {
            test_remove('Uncaught Exception; the sun just exploded and we have 8 minutes to live!', ';', 'the sun just exploded and we have 8 minutes to live!')
        })
    })

    describe('handle_uncaught_exception', function() {
        let test_handle = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stack_parser.handle_uncaught_exception(stack)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_handle(undefined, '')
            test_handle('', '')
        })

        describe('test not uncaught', () => {
            test_handle('Invalid: zxcv is not a real word', '')
        })

        describe('test valid uncaught exception', () => {
            let expected = 'Hello? Is it me you\'re looking for?'
            test_handle('Uncaught exception: System.Is.Sentient.Exception: ' + expected + '; I can see it..', expected)
        })
    })

    describe('handle_corporate_subscription', function() {
        let test_handle = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stack_parser.handle_corporate_subscription(stack)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_handle(undefined, '')
            test_handle('', '')
        })

        describe('test not corporate sub', () => {
            test_handle('Invalid Exception: System.IOException.Factory.Mother.Impl: Inheritance Unkown', '')
        })

        describe('test valid corporate sub stack', () => {
            let expected = 'User has a corporate subscription'
            test_handle('User 1234-asdf-zxcv-qwerty-567890 has a corporate subscription. Subscriber ID: 555555', expected)
        })
    })
})
