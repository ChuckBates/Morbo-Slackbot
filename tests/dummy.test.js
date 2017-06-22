"use strict";

const assert = require('assert')
const dummy = require('../src/dummy')

var simple_mock = require('simple-mock')

describe('dummy', function() {
    describe('get', function() {
        let test_get = (expected, condition) => {
            it('should return ' + JSON.stringify(expected) + ' when ' + condition, () => {
                simple_mock.mock(dummy, 'get').returnWith(expected)
                let result = dummy.get()
                assert.equal(result, expected)
            })
        }

        describe('test', () => {
            let expected = {
                data: 'good'
            }
            test_get(expected, 'mocking \'get\'')
        })

        simple_mock.restore()
    })

    describe('getInner', function() {
        let test_get_inner = (expected, condition) => {
            it('should return ' + JSON.stringify(expected) + ' when ' + condition, () => {
                simple_mock.mock(dummy, 'getInner').returnWith(expected)
                let result = dummy.get()
                assert.deepEqual(result, expected)
            })
        }

        describe('test', () => {
            let expected = {
                data: 'good'
            }
            test_get_inner(expected, 'mocking \'getInner\'')
        })

        simple_mock.restore()
    })
})
