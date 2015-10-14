var port = process.env.PORT || 8000
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var users = [];

app.use(bodyParser.json());

function errorHandler(error, request, response, next)
{
	response.status(500).send();
}

function logErrors(error, request, response, next)
{
	console.error('error:' + JSON.stringify(error, null, 2));
	next(error)
}

// http status codes (401-unauthorized, 404-notfound, 200-ok, 201-created, 204-no content)
// exception handling - http://expressjs.com/guide/error-handling.html
// action filters
// swagger - https://github.com/swagger-api/swagger-node
// building libraries (token) in nodejs
// Set the environment variable NODE_ENV to “production”, to run the app in production mode.

function getAll(request, response){
	var token = request.headers["x-auth"]
	var missing = request.headers['x-missing']
    response.send([{headers: request.headers, token: token, missing: missing + '_'},{users: users}]);
}

function getSingle(request, response){
	if (request.params.id == -1)
	{
		throw {code: 45, message: 'error in single'};
	}
	else if (request.params.id == 0)
	{
		response.status(404).send();
	}
	else
	{
		response.send([{Id: request.params.id, Name:'dan'}]);
	}
}

function add(request, response){
	var body = request.body;
	
	users.push(body);
	response.status(201)
    response.send({body: body});
}

function update(request, response){
	var body = request.body;
    response.send({id: request.params.id, body: body});
}

function deleteSingle(request, response){
	if (request.params.id == 0)
	{
		response.status(404).send();
	}
	else
	{
		response.status(204)
		response.send([{Id: request.params.id, Operation:'delete'}]);
	}
}

app.get('/config', getAll)
app.get('/config/:id', getSingle)
app.post('/config', add)
app.put('/config/:id', update)
app.delete('/config/:id', deleteSingle)

app.use(logErrors);
app.use(errorHandler);

app.listen(port, function(){
    console.log("Server running at http://127.0.0.1:" + port);
})

//module.exports = app;