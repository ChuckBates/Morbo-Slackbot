"use strict";

const assert = require('assert')
const plotly_plotter = require('../src/plotlyPlotter')
const plotlyConfig = require('../plotly.config.json')
const plotly = require('plotly')(plotlyConfig.integrationUser, plotlyConfig.integrationPassword)

var Client = require('node-rest-client').Client
var auth = { user: plotlyConfig.integrationUser, password: plotlyConfig.integrationPassword}
var client = new Client(auth)
var user = plotlyConfig.integrationUser

describe('plotly integration', function() {
    describe('round trip plot', function() {
        let testPlotRoundTrip = (xValues, yValues) => {
            it('should round trip plot when given x: ' + xValues + ' and y: ' + yValues, function(done) {
                this.timeout(45000);
                setTimeout(done, 45000);
                
                roundTripPlot(xValues, yValues, done)               
            })
        }

        describe('test single value', () => {
            let xValues = [1]
            let yValues = ['test']
            testPlotRoundTrip(xValues, yValues)
        })

        describe('test two values', () => {
            let xValues = [2,1]
            let yValues = ['test1', 'test2']
            testPlotRoundTrip(xValues, yValues)
        })

        describe('test one empty value', () => {
            let xValues = [2,1,3]
            let yValues = ['test1', '', 'test2']
            testPlotRoundTrip(xValues, yValues)
        })
    })
})

function buildData(xValues, yValues) {
    return [{
        x: xValues,
        y: yValues,
        marker: {color: 'rgb(0,166,82)'},
        orientation: 'h',
        type: "bar"
    }]
}

function buildLayout() {
    return {
        title: 'Top errors in the last 7 days',
        font: {family: "Raleway, sans-serif"},
        showlegend: false,        
        autosize: false,
        width: 1000,
        height: 500,
        xaxis: {
            gridwidth: 1,
            tickmode: 'linear',
            tick0: 0,
            dtick: 1
        },
        yaxis: {
            zeroline: false,
            gridwidth: 1,
            autorange: 'reversed'
        },
        margin: {
            l: 350,
            r: 50
        },
        bargap: 0.15
    }
}

function roundTripPlot(xValues, yValues, done) {
    let args = { headers: { "Plotly-Client-Platform": "javascript" }}
    let data = buildData(xValues, yValues)
    let layout = buildLayout()
    let graphOptions = {layout: layout, filename: "integration_test", fileopt: "new"}
    plotly.plot(data, graphOptions, function (err, msg) {
        if (err) {
            done(err)
        }
        let plotId = msg.url.substring((msg.url.lastIndexOf('/') + 1))

        client.get("https://api.plot.ly/v2/files/" + user + ":" + plotId, args, function(data, response) {
            assert.equal(response.statusCode, 200)

            client.post("https://api.plot.ly/v2/files/" + user + ":" + plotId + "/trash", args, function(data, response) {
                assert.equal(response.statusCode, 200)

                client.delete("https://api.plot.ly/v2/files/" + user + ":" + plotId + "/permanent_delete", args, function(data, res) {
                    assert.equal(res.statusCode, 204)

                    client.get("https://api.plot.ly/v2/files/" + user + ":" + plotId, args, function(data, response) {
                        assert.equal(response.statusCode, 404)
                        cleanUpGridData(plotId, done)
                    })
                })
            })
        })
    })  
}

function cleanUpGridData(plotId, done) {
    let args = { headers: { "Plotly-Client-Platform": "javascript" }}
    let gridId = ++plotId
    client.post("https://api.plot.ly/v2/files/" + user + ":" + gridId + "/trash", args, function(data, response) {
        assert.equal(response.statusCode, 200)
        client.delete("https://api.plot.ly/v2/files/" + user + ":" + gridId + "/permanent_delete", args, function(data, res) {
            assert.equal(res.statusCode, 204)
            done()
        })
    })
}
