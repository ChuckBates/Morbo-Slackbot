"use strict";

const assert = require('assert')
const distinctErrorAggregator = require('../src/distinctErrorAggregator')

describe('distinctErrorAggregator', function() {
    describe('aggregateDistinctErrors', function() {
        let testAggregate = (headerAndStackList, expected) => {
            it('should return ' + expected + ' when given ' + headerAndStackList, () => {
                let result = distinctErrorAggregator.aggregateDistinctErrors(headerAndStackList)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testAggregate(undefined, [])
            testAggregate([], [])
        })

        describe('test single headerAndStack', () => {
            testAggregate([{stack: 'valid_error'}], [{headerAndStack: {stack: 'valid_error'}, count: 1}])
        })

        describe('test two distinct headerAndStack', () => {
            let headerAndStackList = [{stack: 'valid_error'}, {stack: 'other_valid_error'}]
            let expected = [{headerAndStack: {stack: 'valid_error'}, count: 1},
                            {headerAndStack: {stack: 'other_valid_error'}, count: 1}]
            testAggregate(headerAndStackList, expected)
        })

        describe('test three headerAndStack, with two identical', () => {
            let headerAndStackList = [{stack: 'valid_error'}, {stack: 'other_valid_error'}, {stack: 'valid_error'}]
            let expected = [{headerAndStack: {stack: 'valid_error'}, count: 2},
                            {headerAndStack: {stack: 'other_valid_error'}, count: 1}]
            testAggregate(headerAndStackList, expected)
        })

        describe('test six headerAndStack, order descending by count', () => {
            let headerAndStackList = [
                                            {stack: 'real_error'}, 
                                            {stack: 'other_valid_error'}, 
                                            {stack: 'valid_error'},
                                            {stack: 'valid_error'},
                                            {stack: 'other_valid_error'}, 
                                            {stack: 'valid_error'}
                                        ]
            let expected = [
                                {
                                    headerAndStack: {stack: 'valid_error'}, 
                                    count: 3
                                },
                                {
                                    headerAndStack: {stack: 'other_valid_error'},
                                    count: 2
                                },
                                {
                                    headerAndStack: {stack: 'real_error'},
                                    count: 1
                                }
                            ]
            testAggregate(headerAndStackList, expected)
        })
    })

    describe('incrementErrorCount', function() {
        let testIncrement = (distinctList, error, expected) => {
            it('should return ' + expected + ' when given ' + distinctList.toString() + ' with error ' + error, () => {
                let result = distinctErrorAggregator.incrementErrorCount(distinctList, error)
                assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            let distinctList = []
            testIncrement(distinctList, undefined, distinctList)
            testIncrement(distinctList, '', distinctList)
        })

        describe('test error not in distinct list', () => {
            let error = 'valid_error'
            let distinctList = [
                                    { 
                                        headerAndStack:
                                        {
                                            timestamp: '',
                                            logLevel: '', 
                                            codeClass: '',
                                            project: '', 
                                            stack: 'other_valid_error'
                                        },
                                        count: 1
                                    }
                                ]
            testIncrement(distinctList, error, distinctList)
        })

        describe('test error in distinct list', () => {
            let error = 'valid_error'
            let distinctList = [
                                    { 
                                        headerAndStack:
                                        {
                                            timestamp: '',
                                            logLevel: '', 
                                            codeClass: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 1
                                    }
                                ]
            let expected = [
                                    { 
                                        headerAndStack:
                                        {
                                            timestamp: '',
                                            logLevel: '', 
                                            codeClass: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 2
                                    }
                                ]
            testIncrement(distinctList, error, expected)
        })
    })

    describe('isErrorInList', function() {
        let testIsError = (distinctList, error, expected) => {
            it('should return ' + expected + ' when given ' + distinctList.toString() + ' with error ' + error, () => {
                let result = distinctErrorAggregator.isErrorInList(distinctList, error)
                assert.equal(result, expected)
            })
        }

        describe('test undefined/empty', () => {
            testIsError([], undefined, false)
            testIsError([], '', false)
            testIsError([], 'valid_error', false)
        })

        describe('test list contains error', () => {
            let error = 'valid_error'
            let distinctList = [
                                    { 
                                        headerAndStack:
                                        {
                                            timestamp: '',
                                            logLevel: '', 
                                            codeClass: '',
                                            project: '', 
                                            stack: error
                                        },
                                        count: 1
                                    }
                                ]
            testIsError(distinctList, error, true)
        })

        describe('test list does not contain error', () => {
            let error = 'valid_error'
            let distinctList = [
                                    { 
                                        headerAndStack:
                                        {
                                            timestamp: '',
                                            logLevel: '', 
                                            codeClass: '',
                                            project: '', 
                                            stack: 'error'
                                        },
                                        count: 1
                                    }
                                ]
            testIsError(distinctList, error, false)
        })
    })
})
