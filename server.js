(function() {
  var app, express, mongoose, port;

  express = require("express");

  mongoose = require("mongoose");

  app = express();

  port = 3000;

  app.use(express["static"](__dirname + "/public", {
    redirect: false
  }));

  app.get("/", function(request, response) {
    return response.sendFile("/public/index.html");
  });

  app.listen(port, function() {
    return console.log("server is listening on port " + port);
  });

}).call(this);
