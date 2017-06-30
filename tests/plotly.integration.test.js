"use strict";

const assert = require('assert')
const plotly_plotter = require('../src/plotly_plotter')
const plotlyConfig = require('../plotly.config.json')
const plotly = require('plotly')(plotlyConfig.integrationUser, plotlyConfig.integrationPassword)

var Client = require('node-rest-client').Client
var auth = { user: plotlyConfig.integrationUser, password: plotlyConfig.integrationPassword}
var client = new Client(auth)
var user = plotlyConfig.integrationUser

describe('plotly integration', function() {
    describe('round trip plot', function() {
        let testPlotRoundTrip = (x_values, y_values) => {
            it('should round trip plot when given x: ' + x_values + ' and y: ' + y_values, function(done) {
                this.timeout(45000);
                setTimeout(done, 45000);
                
                roundTripPlot(x_values, y_values, done)               
            })
        }

        describe('test single value', () => {
            let x_values = [1]
            let y_values = ['test']
            testPlotRoundTrip(x_values, y_values)
        })

        describe('test two values', () => {
            let x_values = [2,1]
            let y_values = ['test1', 'test2']
            testPlotRoundTrip(x_values, y_values)
        })

        describe('test one empty value', () => {
            let x_values = [2,1,3]
            let y_values = ['test1', '', 'test2']
            testPlotRoundTrip(x_values, y_values)
        })
    })
})

function buildData(x_values, y_values) {
    return [{
        x: x_values,
        y: y_values,
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

function roundTripPlot(x_values, y_values, done) {
    let args = { headers: { "Plotly-Client-Platform": "javascript" }}
    let data = buildData(x_values, y_values)
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
