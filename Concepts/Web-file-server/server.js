
var http = require("http");

function onRequest(request, response ) {
    console.log('user made a reuqest' + request.url);
    response.writeHead(200,{"Context-Type":"text/plain"});
    response.write("Here is some data");
    response.end();
}

http.createServer(onRequest).listen(8888);

