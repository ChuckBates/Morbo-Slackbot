"use strict";

const assert = require('assert')
const listCleaner = require('../src/listCleaner')

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
                    headerAndStack: {
                        timestamp: '2017-06-27 20:19:08,162',
                        logLevel: 'ERROR',
                        codeClass: 'PS.Services.UserAccountsNan.IndividualSubscriptionUpdatedHandler',
                        project: 'PS.UserAccountsServiceNan',
                        stack: 'clean'
                    }, 
                    count: 32
                }
            ]
            testClean(list, list)
        })

        describe('when the list has one with an undefined/empty stack', () => {
            let list = [ { headerAndStack: { stack: undefined } } ]
            testClean(list, list)

            list = [ { headerAndStack: { stack: '' } } ]
            testClean(list, list)
        })

        describe('when the list has one with a single URL encoded char', () => {
            let list = [ { headerAndStack: { stack: 'error%3Eerror' } } ]
            let expected = [ { headerAndStack: { stack: 'error>error \(URL decoded\)' } } ]
            testClean(list, expected)
        })

        describe('when the list has one with several URL encoded chars', () => {
            let list = [ { headerAndStack: { stack: 'error%3C%24%3Eerror' } } ]
            let expected = [ { headerAndStack: { stack: 'error<$>error \(URL decoded\)' } } ]
            testClean(list, expected)
        })

        describe('when the list has one with several URL encoded chars and spaces', () => {
            let list = [ { headerAndStack: { stack: 'error%20%3D%3D%3E%20error' } } ]
            let expected = [ { headerAndStack: { stack: 'error ==> error \(URL decoded\)' } } ]
            testClean(list, expected)
        })

        describe('when the list has multiple with URL encoded chars', () => {
            let list = [ 
                { headerAndStack: { stack: 'error%20%3D%3D%3E%20error' } },
                { headerAndStack: { stack: 'error%3D%3D%3Eerror' } }
            ]
            let expected = [ 
                { headerAndStack: { stack: 'error ==> error \(URL decoded\)' } },
                { headerAndStack: { stack: 'error==>error \(URL decoded\)' } }
            ]
            testClean(list, expected)
        })

        describe('when the list has one with html encoded entity', () => {
            let list = [ { headerAndStack: { stack: 'Error creating user ---&gt' } } ]
            let expected = [ { headerAndStack: { stack: 'Error creating user ---> \(HTML decoded\)' } } ]
            testClean(list, expected)
        })

        describe('when the list has one with html encoded entity and URL encoded chars', () => {
            let list = [ { headerAndStack: { stack: 'Error crea%3Eting user ---&gt;' } } ]
            let expected = [ { headerAndStack: { stack: 'Error crea>ting user ---> \(URL decoded\) \(HTML decoded\)' } } ]
            testClean(list, expected)
        })
    })
})
