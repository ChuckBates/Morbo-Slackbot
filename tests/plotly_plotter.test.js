"use strict";

const assert = require('assert')
const plotly_plotter = require('../src/plotly_plotter')

describe('plotly_plotter', function() {
    describe('extract_x_y_values', function() {
        let test_extract = (distinct_list, expected) => {
            it('should return ' + expected + ' when given ' + JSON.stringify(distinct_list), () => {
                let result = plotly_plotter.extract_x_y_values(distinct_list)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_extract(undefined, [])
            test_extract([], [])
        })

        describe('test single value', () => {
            let distinct_list = [{header_and_stack: {stack: 'valid_error'}, count: 1}]
            let expected = {x_values: [1], y_values: ['valid_error']}
            test_extract(distinct_list, expected)
        })

        describe('test multiple values', () => {
            let distinct_list = [
                {
                    header_and_stack: {
                        stack: 'valid_error'
                    },
                    count: 3
                },
                {
                    header_and_stack: {
                        stack: 'other_valid_error'
                    },
                    count: 5
                },
                {
                    header_and_stack: {
                        stack: 'yet_another_valid_error'
                    },
                    count: 2
                }
            ]
            let expected = { x_values: [3,5,2], y_values: ['valid_error','other_valid_error','yet_another_valid_error']}
            test_extract(distinct_list, expected)
        })
    })
})