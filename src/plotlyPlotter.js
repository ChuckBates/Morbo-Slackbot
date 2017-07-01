module.exports = {
    preparePlot: preparePlot,
    extractValues: extractValues
}

var morbo = require('./morbo.js')
var consts = require('./consts.js')
var plotlyConfig = require('../plotly.config.json')
var plotly = require('plotly')(plotlyConfig.user, plotlyConfig.password)

function preparePlot(distinctList) {
    var values = extractValues(distinctList)

    var data = [
        {
            x: values.xValues,
            y: values.yValues,
            marker: {color: 'rgb(0,166,82)'},
            orientation: 'h',
            type: "bar"
        }
    ]

    var layout = {
        title: 'Top errors in the last ' + consts.getDays() + ' days',
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
    var graphOptions = {layout: layout, filename: "test3", fileopt: "new"}
    plotly.plot(data, graphOptions, function (err, msg) {
        if (err) {
            console.log(err)
        }
        postGraph(msg.url)
    })
}

function extractValues(distinctList) {
    if (distinctList === undefined || JSON.stringify(distinctList) === JSON.stringify([])) {
        return []
    }

    var xValues = []
    var yValues = []

    for (var i = 0; i < distinctList.length; i++) {
        xValues.push(distinctList[i].count)
        yValues.push(distinctList[i].headerAndStack.stack)
    }

    return {xValues: xValues, yValues: yValues}
}

function postGraph(url) {
    var message = { 
        channel: consts.botTestingChannelId, 
        username: 'Morbo',
        as_user: false,
        icon_emoji: ':morbo:',
        attachments: [
            {
                fallback: 'Puny human vermin, Morbo dislikes numbers! And cats!',
                title: "Human numbers do not challenge Morbo",
                title_link: url + '.png',
                text: "Puny human vermin, Morbo dislikes numbers! And cats!",
                image_url: url + '.png',
                color: "#00A652"
            }
        ]
    }

    morbo.postMessage(message)
}
