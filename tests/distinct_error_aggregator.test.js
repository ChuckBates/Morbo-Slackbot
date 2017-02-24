"use strict";

const assert = require('assert')
const distinct_error_aggregator = require('../src/distinct_error_aggregator')

describe('distinct_error_aggregator', function() {
    describe('aggregate_distinct_errors', function() {
        let test_aggregate = (header_and_stack_list, expected) => {
            it('should return ' + expected + ' when given ' + header_and_stack_list, () => {
                let result = distinct_error_aggregator.aggregate_distinct_errors(header_and_stack_list)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_aggregate(undefined, [])
            test_aggregate([], [])
        })

        describe('test single header_and_stack', () => {
            test_aggregate([{stack: 'valid_error'}], [{header_and_stack: {stack: 'valid_error'}, count: 1}])
        })

        describe('test two distinct header_and_stack', () => {
            let header_and_stack_list = [{stack: 'valid_error'}, {stack: 'other_valid_error'}]
            let expected = [{header_and_stack: {stack: 'valid_error'}, count: 1},
                            {header_and_stack: {stack: 'other_valid_error'}, count: 1}]
            test_aggregate(header_and_stack_list, expected)
        })

        describe('test three header_and_stack, with two identical', () => {
            let header_and_stack_list = [{stack: 'valid_error'}, {stack: 'other_valid_error'}, {stack: 'valid_error'}]
            let expected = [{header_and_stack: {stack: 'valid_error'}, count: 2},
                            {header_and_stack: {stack: 'other_valid_error'}, count: 1}]
            test_aggregate(header_and_stack_list, expected)
        })

        describe('test six header_and_stack, order descending by count', () => {
            let header_and_stack_list = [
                                            {stack: 'real_error'}, 
                                            {stack: 'other_valid_error'}, 
                                            {stack: 'valid_error'},
                                            {stack: 'valid_error'},
                                            {stack: 'other_valid_error'}, 
                                            {stack: 'valid_error'}
                                        ]
            let expected = [
                                {
                                    header_and_stack: {stack: 'valid_error'}, 
                                    count: 3
                                },
                                {
                                    header_and_stack: {stack: 'other_valid_error'},
                                    count: 2
                                },
                                {
                                    header_and_stack: {stack: 'real_error'},
                                    count: 1
                                }
                            ]
            test_aggregate(header_and_stack_list, expected)
        })
    })

    describe('increment_error_count', function() {
        let test_increment = (distinct_list, error, expected) => {
            it('should return ' + expected + ' when given ' + distinct_list.toString() + ' with error ' + error, () => {
                let result = distinct_error_aggregator.increment_error_count(distinct_list, error)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            let distinct_list = []
            test_increment(distinct_list, undefined, distinct_list)
            test_increment(distinct_list, '', distinct_list)
        })

        describe('test error not in distinct list', () => {
            let error = 'valid_error'
            let distinct_list = [
                                    { 
                                        header_and_stack:
                                        {
                                            timestamp: '',
                                            log_level: '', 
                                            code_class: '',
                                            project: '', 
                                            stack: 'other_valid_error'
                                        },
                                        count: 1
                                    }
                                ]
            test_increment(distinct_list, error, distinct_list)
        })

        describe('test error in distinct list', () => {
            let error = 'valid_error'
            let distinct_list = [
                                    { 
                                        header_and_stack:
                                        {
                                            timestamp: '',
                                            log_level: '', 
                                            code_class: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 1
                                    }
                                ]
            let expected = [
                                    { 
                                        header_and_stack:
                                        {
                                            timestamp: '',
                                            log_level: '', 
                                            code_class: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 2
                                    }
                                ]
            test_increment(distinct_list, error, expected)
        })
    })

    describe('is_error_in_list', function() {
        let test_is_error = (distinct_list, error, expected) => {
            it('should return ' + expected + ' when given ' + distinct_list.toString() + ' with error ' + error, () => {
                let result = distinct_error_aggregator.is_error_in_list(distinct_list, error)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            test_is_error([], undefined, false)
            test_is_error([], '', false)
            test_is_error([], 'valid_error', false)
        })

        describe('test list contains error', () => {
            let error = 'valid_error'
            let distinct_list = [
                                    { 
                                        header_and_stack:
                                        {
                                            timestamp: '',
                                            log_level: '', 
                                            code_class: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 1
                                    }
                                ]
            test_is_error(distinct_list, error, true)
        })

        describe('test list does not contain error', () => {
            let error = 'valid_error'
            let distinct_list = [
                                    { 
                                        header_and_stack:
                                        {
                                            timestamp: '',
                                            log_level: '', 
                                            code_class: '',
                                            project: '', 
                                            stack: 'error'
                                        },
                                        count: 1
                                    }
                                ]
            test_is_error(distinct_list, error, false)
        })
    })
})