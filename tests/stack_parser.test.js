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
            test_remove('Uncaught Exception: the sun just exploded and we have 8 minutes to live!', ':', 'the sun just exploded and we have 8 minutes to live!')
        })
    })
})
