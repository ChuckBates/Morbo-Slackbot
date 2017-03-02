"use strict";

const assert = require('assert')
const morbo = require('../src/morbo')

var simple_mock = require('simple-mock')
var Botkit = require('../lib/Botkit.js')

describe('morbo', function() {
    describe('get_data_to_save', function() {
        let test_get_data_to_save = (json, days, hour, minute, expected) => {
            it('should return ' + JSON.stringify(expected) + ' when given ' + 
                JSON.stringify(json) + ', ' + days + ', ' + hour + ', ' + minute, () => {
                    let result = morbo.get_data_to_save(json, days, hour, minute)
                    assert.deepEqual(result, expected)
            })
        }

        describe('test undefined/empty json', () => {
            let json = undefined
            let days = 6
            let hour = 9
            let minute = 15
            test_get_data_to_save(json, days, hour, minute, {interval:days, hour:hour, minute:minute})

            json = {}
            test_get_data_to_save(json, days, hour, minute, {interval:days, hour:hour, minute:minute})
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
            test_get_data_to_save(json, days, hour, minute, expected)
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
            test_get_data_to_save(json, days, hour, minute, expected)
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
            test_get_data_to_save(json, days, hour, minute, expected)
        })

        describe('test interval already stored but not updated', () => {
            let json = {
                interval: 6
            }
            morbo.set_interval(6)
            let hour = 1
            let minute = 1
            let expected = {
                interval: 6,
                hour: hour,
                minute: minute
            }
            test_get_data_to_save(json, undefined, hour, minute, expected)
            test_get_data_to_save(json, '', hour, minute, expected)
        })

        describe('test hour already stored but not updated', () => {
            let json = {
                hour: 6
            }
            morbo.set_hour(6)
            let days = 8
            let minute = 1
            let expected = {
                interval: days,
                hour: 6,
                minute: minute
            }
            test_get_data_to_save(json, days, undefined, minute, expected)
            test_get_data_to_save(json, days, '', minute, expected)
        })

        describe('test minute already stored but not updated', () => {
            let json = {
                minute: 6
            }
            morbo.set_minute(6)
            let days = 8
            let hour = 1
            let expected = {
                interval: days,
                hour: hour,
                minute: 6
            }
            test_get_data_to_save(json, days, hour, undefined, expected)
            test_get_data_to_save(json, days, hour, '', expected)
        })
    })

    describe('check_valid_number', function() {
        let test_check_valid_number = (bot, message, value, expected) => {
            it('should return ' + expected + ' when given ' + value, () => {
                simple_mock.mock(bot, 'reply').callFn(function() {})
                let result = morbo.check_valid_number(bot, message, value)
                assert.equal(result, expected)
            })
        }

        describe('test undefined', () => {
            let bot = Botkit.slackbot({})
            let message = ''
            let value = undefined
            test_check_valid_number(bot, message, value, false)
        })

        describe('test not NaN', () => {
            let bot = Botkit.slackbot({})
            let message = ''
            let value = 4
            test_check_valid_number(bot, message, value, true)
        })

        describe('test is NaN', () => {
            let bot = Botkit.slackbot({})
            let message = ''
            test_check_valid_number(bot, message, NaN, false)
        })

        simple_mock.restore();
    })
})
