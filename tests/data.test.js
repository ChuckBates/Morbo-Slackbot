"use strict";

const assert = require('assert')
const data = require('../src/data')

var consts = require('../src/consts')
var simpleMock = require('simple-mock')
var botkit = require('../lib/Botkit')

describe('data', function() {
    describe('getDataToSave', function() {
        let testGetDataToSave = (json, days, hour, minute, expected) => {
            it('should return ' + JSON.stringify(expected) + ' when given ' + 
                JSON.stringify(json) + ', ' + days + ', ' + hour + ', ' + minute, () => {
                    let result = data.getDataToSave(json, days, hour, minute)
                    assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty json', () => {
            let json = undefined
            let days = 6
            let hour = 9
            let minute = 15
            testGetDataToSave(json, days, hour, minute, {interval:days, hour:hour, minute:minute})

            json = {}
            testGetDataToSave(json, days, hour, minute, {interval:days, hour:hour, minute:minute})
        })

        describe('test interval already stored then updated', () => {
            let json = {
                interval: 6
            }
            let days = 12
            let hour = 1
            let minute = 1
            let expected = {
                interval: days,
                hour: hour,
                minute: minute
            }
            testGetDataToSave(json, days, hour, minute, expected)
        })

        describe('test hour already stored then updated', () => {
            let json = {
                hour: 6
            }
            let days = 12
            let hour = 1
            let minute = 1
            let expected = {
                interval: days,
                hour: hour,
                minute: minute
            }
            testGetDataToSave(json, days, hour, minute, expected)
        })

        describe('test minute already stored then updated', () => {
            let json = {
                minute: 6
            }
            let days = 12
            let hour = 1
            let minute = 1
            let expected = {
                interval: days,
                hour: hour,
                minute: minute
            }
            testGetDataToSave(json, days, hour, minute, expected)
        })

        describe('test interval already stored but not updated', () => {
            let json = {
                interval: 6
            }
            consts.setDays(6)
            let hour = 1
            let minute = 1
            let expected = {
                interval: 6,
                hour: hour,
                minute: minute
            }
            testGetDataToSave(json, undefined, hour, minute, expected)
            testGetDataToSave(json, '', hour, minute, expected)
        })

        describe('test hour already stored but not updated', () => {
            let json = {
                hour: 6
            }
            consts.setHour(6)
            let days = 8
            let minute = 1
            let expected = {
                interval: days,
                hour: 6,
                minute: minute
            }
            testGetDataToSave(json, days, undefined, minute, expected)
            testGetDataToSave(json, days, '', minute, expected)
        })

        describe('test minute already stored but not updated', () => {
            let json = {
                minute: 6
            }
            consts.setMinute(6)
            let days = 8
            let hour = 1
            let expected = {
                interval: days,
                hour: hour,
                minute: 6
            }
            testGetDataToSave(json, days, hour, undefined, expected)
            testGetDataToSave(json, days, hour, '', expected)
        })
    })

    describe('checkValidNumber', function() {
        let testCheckValidNumber = (bot, message, value, expected) => {
            it('should return ' + expected + ' when given ' + value, () => {
                simpleMock.mock(bot, 'reply').callFn(function() {})
                let result = data.checkValidNumber(bot, message, value)
                assert.equal(result, expected)
            })
        }

        describe('test undefined', () => {
            let bot = botkit.slackbot({})
            let message = ''
            let value = undefined
            testCheckValidNumber(bot, message, value, false)
        })

        describe('test not NaN', () => {
            let bot = botkit.slackbot({})
            let message = ''
            let value = 4
            testCheckValidNumber(bot, message, value, true)
        })

        describe('test is NaN', () => {
            let bot = botkit.slackbot({})
            let message = ''
            testCheckValidNumber(bot, message, NaN, false)
        })

        simpleMock.restore();
    })
})
