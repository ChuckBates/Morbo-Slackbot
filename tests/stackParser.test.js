"use strict";

const assert = require('assert')
const stackParser = require('../src/stackParser')

describe('stackParser', function() {
    describe('parse', function() {
        let testParse = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stackParser.parse(stack)
                assert.equal(result, expected)
            })
        }

        describe('test valid corporate sub', () => {
            let expected = 'User has a corporate subscription'
            testParse('User 1234-asdf-zxcv-qwerty-567890 has a corporate subscription. Subscriber ID: 555555', expected)
        })

        describe('test valid inner exception', () => {
            let expected = 'It was not possible to connect to the redis server(s)'
            let stack = 'Inner exception: StackExchange.Redis.RedisConnectionException: ' + 
                        expected + 
                        '; to create a disconnected multiplexer'
            testParse(stack, expected)
        })

        describe('test valid uncaught exception', () => {
            let expected = 'Email record not found'
            let stack = 'Uncaught exception:: System.InvalidOperationException: Email record not found. ' +
                        'Attempting to find email eric-andres+test-failure@pluralsight.com ' +
                        'for handle d2f32396-4445-496a-a61d-22d7c51a3bcb;    ' +
                        'at PS.Identity.Email.EmailHandler.ThrowIfEmailRecordIsNull(EmailRecordV2 '
            testParse(stack, expected)
        })
    })

    describe('extractFirstStatement', function() {
        let testExtract = (stack, separator, expected) => {
            it('should return ' + expected + ' when given ' + stack + ' with separator ' + separator, () => {
                let result = stackParser.extractFirstStatement(stack, separator)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testExtract(undefined, ':', '')
            testExtract('', ':', '')
        })

        describe('test separator not present', () => {
            testExtract('asdf', ':', '')
        })

        describe('test stack with multiple separators', () => {
            testExtract('Uncaught Exception:: what was that whole one in a million talk?', ':', 'Uncaught Exception')
        })

        describe('test valid stack', () => {
            testExtract('Uncaught Exception: patient zero has started to spread!', ':', 'Uncaught Exception')
        })
    })

    describe('removeFirstStatement', function() {
        let testRemove = (stack, separator, expected) => {
            it('should return ' + expected + ' when given ' + stack + ' with separator ' + separator, () => {
                let result = stackParser.removeFirstStatement(stack, separator)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testRemove(undefined, ':', '')
            testRemove('', ':', '')
        })

        describe('test separator not present', () => [
            testRemove('asdf zxcv', ':', '')
        ])

        describe('test stack with multiple separators', () => {
            testRemove('Uncaught Exception:: what was that whole one in a million talk?', ':', 'what was that whole one in a million talk?')
        })

        describe('test valid stack', () => {
            testRemove('Uncaught Exception; the sun just exploded and we have 8 minutes to live!', ';', 'the sun just exploded and we have 8 minutes to live!')
        })
    })

    describe('handleUncaughtOrInnerException', function() {
        let testHandle = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stackParser.handleUncaughtOrInnerException(stack)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testHandle(undefined, '')
            testHandle('', '')
        })

        describe('test not uncaught and not inner', () => {
            testHandle('Invalid: zxcv is not a real word', '')
        })

        describe('test valid inner exception', () => {
            let expected = 'It was not possible to connect to the redis server(s)'
            let stack = 'Inner exception: StackExchange.Redis.RedisConnectionException: ' + 
                        expected + 
                        '; to create a disconnected multiplexer'
            testHandle(stack, expected)
        })

        describe('test valid uncaught exception', () => {
            let expected = 'Hello? Is it me you\'re looking for?'
            testHandle('Uncaught exception: System.Is.Sentient.Exception: ' + expected + '; I can see it..', expected)
        })
    })

    describe('handleCorporateSubscription', function() {
        let testHandle = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let result = stackParser.handleCorporateSubscription(stack)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testHandle(undefined, '')
            testHandle('', '')
        })

        describe('test not corporate sub', () => {
            testHandle('Invalid Exception: System.IOException.Factory.Mother.Impl: Inheritance Unkown', '')
        })

        describe('test valid corporate sub stack', () => {
            let expected = 'User has a corporate subscription'
            testHandle('User 1234-asdf-zxcv-qwerty-567890 has a corporate subscription. Subscriber ID: 555555', expected)
        })
    })

    describe('extractShortError', function() {
        let testExtract = (stack, expected) => {
            it('should return ' + expected + ' when given ' + stack, () => {
                let space = ' '
                let result = stackParser.extractShortError(stack, space)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testExtract(undefined, '')
            testExtract('', '')
        })

        describe('test has period + space in first 100 characters', () => {
            let expected = 'Email record not found'
            testExtract('Email record not found. Attempting to find email for handle', expected)
        })

        describe('test has colon + space in first 100 characters', () => {
            let expected = 'Email record not found'
            testExtract('Email record not found: Attempting to find email for handle', expected)
        })

        describe('test has semi-colon + space in first 100 characters', () => {
            let expected = 'Email record not found'
            testExtract('Email record not found; Attempting to find email for handle', expected)
        })

        describe('test has comma + space in first 100 characters', () => {
            let expected = 'Email record not found'
            testExtract('Email record not found, Attempting to find email for handle', expected)
        })

        describe('test has colon + NO space after first 75 characters', () => {
            let expected = 'Timeout performing GET identity-unauthorized-device-id'
            let stack = expected + ':3840G-3N3287G2-G34323G3-6NJDD23G4'
            testExtract(stack, expected)
        })

        describe('test has period + NO space in first 75 characters and colon + space in first 100 characters', () => {
            let expected = 'Error while building type PS.Redis.RedisSession'
            let stack = expected + ': Unable to connect to the Redis database'
            testExtract(stack, expected)
        })

        describe('test has period + space and size is > 75', () => {
            let expected = 'The view \'Index\' or its master was not found or no view engine supports the searched locations'
            let stack = expected + ". The following locations were searched:"
            expected = expected.slice(0, 60) + '...'
            testExtract(stack, expected)
        })
    })

    describe('stackHasMoreSeparators', function() {
        let testForMoreSeparators = (stack, space, expected) => {
            it('should return ' + expected + ' when given stack \'' + stack + space + '\'', () => {
                let result = stackParser.stackHasMoreSeparators(stack, space)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testForMoreSeparators(undefined, '', false)
            testForMoreSeparators('', '', false)
        })

        describe('test text with single colon separator', () => {
            testForMoreSeparators('asdf: ', ' ', true)
        })

        describe('test text with single comma separator', () => {
            testForMoreSeparators('asdf, ', ' ', true)
        })

        describe('test text with single semi-colon separator', () => {
            testForMoreSeparators('asdf; ', ' ', true)
        })

        describe('test text with single period separator', () => {
            testForMoreSeparators('asdf. ', ' ', true)
        })

        describe('test text with multiple separators', () => {
            testForMoreSeparators('just; a, single: test.', ' ', true)
        })

        describe('test text with no space after separator', () => {
            testForMoreSeparators('test:foo;bar', '', true)
        })
    })
})
