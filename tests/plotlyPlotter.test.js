"use strict";

const assert = require('assert')
const plotlyPlotter = require('../src/plotlyPlotter')

describe('plotlyPlotter', function() {
    describe('extractValues', function() {
        let testExtract = (distinctList, expected) => {
            it('should return ' + expected + ' when given ' + JSON.stringify(distinctList), () => {
                let result = plotlyPlotter.extractValues(distinctList)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testExtract(undefined, [])
            testExtract([], [])
        })

        describe('test single value', () => {
            let distinctList = [{headerAndStack: {stack: 'valid_error'}, count: 1}]
            let expected = {xValues: [1], yValues: ['valid_error']}
            testExtract(distinctList, expected)
        })

        describe('test multiple values', () => {
            let distinctList = [
                {
                    headerAndStack: {
                        stack: 'valid_error'
                    },
                    count: 3
                },
                {
                    headerAndStack: {
                        stack: 'other_valid_error'
                    },
                    count: 5
                },
                {
                    headerAndStack: {
                        stack: 'yet_another_valid_error'
                    },
                    count: 2
                }
            ]
            let expected = { xValues: [3,5,2], yValues: ['valid_error','other_valid_error','yet_another_valid_error']}
            testExtract(distinctList, expected)
        })
    })
})
