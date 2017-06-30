"use strict";

const assert = require('assert')
const listCleaner = require('../src/ListCleaner')

describe('ListCleaner', function() {
    describe('clean', function() {
        let testClean = (list, expected) => {
            it('should return ' + expected + ' when given ' + JSON.stringify(list), () => {
                let result = listCleaner.clean(list)
                assert.deepEqual(result, expected)
            })
        }

        describe('when the list is null/empty', () => {
            let expected = undefined
            testClean(undefined, expected)

            expected = []
            testClean([], expected)
        })

        describe('when the list has one that is already clean', () => {
            let list = [
                {
                    header_and_stack: {
                        timestamp: '2017-06-27 20:19:08,162',
                        log_level: 'ERROR',
                        code_class: 'PS.Services.UserAccountsNan.IndividualSubscriptionUpdatedHandler',
                        project: 'PS.UserAccountsServiceNan',
                        stack: 'clean'
                    }, 
                    count: 32
                }
            ]
            testClean(list, list)
        })

        describe('when the list has one with an undefined/empty stack', () => {
            let list = [ { header_and_stack: { stack: undefined } } ]
            testClean(list, list)

            list = [ { header_and_stack: { stack: '' } } ]
            testClean(list, list)
        })

        describe('when the list has one with a single unclean char', () => {
            let list = [ { header_and_stack: { stack: 'error%3Eerror' } } ]
            let expected = [ { header_and_stack: { stack: 'error>error' } } ]
            testClean(list, expected)
        })

        describe('when the list has one with several unclean chars', () => {
            let list = [ { header_and_stack: { stack: 'error%3C%24%3Eerror' } } ]
            let expected = [ { header_and_stack: { stack: 'error<$>error' } } ]
            testClean(list, expected)
        })

        describe('when the list has one with several unclean chars and spaces', () => {
            let list = [ { header_and_stack: { stack: 'error%20%3D%3D%3E%20error' } } ]
            let expected = [ { header_and_stack: { stack: 'error ==> error' } } ]
            testClean(list, expected)
        })

        describe('when the list has multiple with unclean chars', () => {
            let list = [ 
                { header_and_stack: { stack: 'error%20%3D%3D%3E%20error' } },
                { header_and_stack: { stack: 'error%3D%3D%3Eerror' } }
            ]
            let expected = [ 
                { header_and_stack: { stack: 'error ==> error' } },
                { header_and_stack: { stack: 'error==>error' } }
            ]
            testClean(list, expected)
        })
    })
})
