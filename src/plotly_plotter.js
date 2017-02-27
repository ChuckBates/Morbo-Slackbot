module.exports = {
    prepare_plot: prepare_plot,
    extract_x_y_values: extract_x_y_values
}

var morbo = require('./morbo.js')
var consts = require('./consts.js')
var plotly = require('plotly')("chuck-bates", "R3y8X5BnFCXR2jYSslAZ")

function prepare_plot(distinct_list) {
    var xy = extract_x_y_values(distinct_list)

    var data = [
        {
            x: xy.x_values,
            y: xy.y_values,
            marker: {color: 'rgb(0,166,82)'},
            orientation: 'h',
            type: "bar"
        }
    ]

    var layout = {
        title: 'Top errors in the last ' + morbo.get_interval() + ' days',
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
        post_graph(msg.url)
    })
}

function extract_x_y_values(distinct_list) {
    if (distinct_list === undefined || JSON.stringify(distinct_list) === JSON.stringify([])) {
        return []
    }

    var x_values = []
    var y_values = []

    for (var i = 0; i < distinct_list.length; i++) {
        x_values.push(distinct_list[i].count)
        y_values.push(distinct_list[i].header_and_stack.stack)
    }

    return {x_values: x_values, y_values: y_values}
}

function post_graph(url) {
    var message = { 
        channel: consts.bot_testing_channel_id, 
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

    morbo.post_message(message)
}
