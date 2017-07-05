module.exports = {
    start: start
}

var restify = require('restify')
var plugins = require('restify-plugins')
var professor = require('./professor')
var commands = require('./commands')
var restifyConfig = require('../restify.config.json')

var server = restify.createServer({
    hostname: restifyConfig.hostname,
    port: restifyConfig.port,
    name: restifyConfig.name,
    method: restifyConfig.method,
})

server.use(plugins.bodyParser());

function start() {
    server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url)
    });
}

server.post('/hook', function create(req, res) {
    var response = professor.handleMessage(req.body)
    commands.postMessage(response.slackMessage)
    res.send(response.code, response.message)
 })
