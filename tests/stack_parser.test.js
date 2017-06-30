"use strict";

const assert = require('assert')
const stack_parser = require('../src/stack_parser')

describe('stack_parser', function() {
    describe('parse', function() {
        let test_parse = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stack_parser.parse(stack)
                assert.equal(result, expected)
            })
        }

        describe('test valid corporate sub', () => {
            let expected = 'User has a corporate subscription'
            test_parse('User 1234-asdf-zxcv-qwerty-567890 has a corporate subscription. Subscriber ID: 555555', expected)
        })

        describe('test valid inner exception', () => {
            let expected = 'It was not possible to connect to the redis server(s)'
            let stack = 'Inner exception: StackExchange.Redis.RedisConnectionException: ' + 
                        expected + 
                        '; to create a disconnected multiplexer'
            test_parse(stack, expected)
        })

        describe('test valid uncaught exception', () => {
            let expected = 'Email record not found'
            let stack = 'Uncaught exception:: System.InvalidOperationException: Email record not found. ' +
                        'Attempting to find email eric-andres+test-failure@pluralsight.com ' +
                        'for handle d2f32396-4445-496a-a61d-22d7c51a3bcb;    ' +
                        'at PS.Identity.Email.EmailHandler.ThrowIfEmailRecordIsNull(EmailRecordV2 '
            test_parse(stack, expected)
        })
    })

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

    describe('handle_uncaught_or_inner_exception', function() {
        let test_handle = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stack_parser.handle_uncaught_or_inner_exception(stack)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_handle(undefined, '')
            test_handle('', '')
        })

        describe('test not uncaught and not inner', () => {
            test_handle('Invalid: zxcv is not a real word', '')
        })

        describe('test valid inner exception', () => {
            let expected = 'It was not possible to connect to the redis server(s)'
            let stack = 'Inner exception: StackExchange.Redis.RedisConnectionException: ' + 
                        expected + 
                        '; to create a disconnected multiplexer'
            test_handle(stack, expected)
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

    describe('extract_short_error', function() {
        let test_extract = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let space = ' '
                let result = stack_parser.extract_short_error(stack, space)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract(undefined, '')
            test_extract('', '')
        })

        describe('test has period + space in first 100 characters', () => {
            let expected = 'Email record not found'
            test_extract('Email record not found. Attempting to find email for handle', expected)
        })

        describe('test has colon + space in first 100 characters', () => {
            let expected = 'Email record not found'
            test_extract('Email record not found: Attempting to find email for handle', expected)
        })

        describe('test has semi-colon + space in first 100 characters', () => {
            let expected = 'Email record not found'
            test_extract('Email record not found; Attempting to find email for handle', expected)
        })

        describe('test has comma + space in first 100 characters', () => {
            let expected = 'Email record not found'
            test_extract('Email record not found, Attempting to find email for handle', expected)
        })

        describe('test has colon + NO space after first 75 characters', () => {
            let expected = 'Timeout performing GET identity-unauthorized-device-id'
            let stack = expected + ':3840G-3N3287G2-G34323G3-6NJDD23G4'
            test_extract(stack, expected)
        })

        describe('test has period + NO space in first 75 characters and colon + space in first 100 characters', () => {
            let expected = 'Error while building type PS.Redis.RedisSession'
            let stack = expected + ': Unable to connect to the Redis database'
            test_extract(stack, expected)
        })

        describe('test has period + space and size is > 75', () => {
            let expected = 'The view \'Index\' or its master was not found or no view engine supports the searched locations'
            let stack = expected + ". The following locations were searched:"
            test_extract(stack, expected)
        })
    })

    describe('stack_has_more_separators', function() {
        let test_for_more_separators = (stack, space, expected) => {
            it('should return ' + expected + ' when given stack \'' + stack + space + '\'', () => {
                let result = stack_parser.stack_has_more_separators(stack, space)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_for_more_separators(undefined, '', false)
            test_for_more_separators('', '', false)
        })

        describe('test text with single colon separator', () => {
            test_for_more_separators('asdf: ', ' ', true)
        })

        describe('test text with single comma separator', () => {
            test_for_more_separators('asdf, ', ' ', true)
        })

        describe('test text with single semi-colon separator', () => {
            test_for_more_separators('asdf; ', ' ', true)
        })

        describe('test text with single period separator', () => {
            test_for_more_separators('asdf. ', ' ', true)
        })

        describe('test text with multiple separators', () => {
            test_for_more_separators('just; a, single: test.', ' ', true)
        })

        describe('test text with no space after separator', () => {
            test_for_more_separators('test:foo;bar', '', true)
        })
    })
})
