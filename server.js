(function() {
  var ObjectId, Schema, app, backbone, backboneSchema, db, express, mongoose, plugin, pluginSchema, port, schemas;

  express = require("express");

  mongoose = require("mongoose");

  app = express();

  port = 3000;

  console.log("3 string");

  db = mongoose.connect("mongodb://localhost/site", {
    server: {
      poolSize: 1
    }
  });

  app.use(express["static"](__dirname + "/public", {
    redirect: false
  }));

  app.get("/", function(request, response) {
    return response.sendFile("/public/index.html");
  });

  Schema = db.Schema;

  pluginSchema = new Schema({
    title: String,
    description: String,
    articleId: String,
    _id: String
  }, {
    collection: "plugin"
  });

  plugin = mongoose.model("plugin", pluginSchema);

  app.get(/^\/plugin\/(\w+)(?:\?find=(\w+))?$/, function(request, response) {
    var acceptableFields, expression, filteredQuery;
    expression = new RegExp(request.query.find, "i");
    filteredQuery = [];
    acceptableFields = ["title", "description"];
    acceptableFields.forEach(function(field) {
      var condition;
      condition = {};
      condition[field] = expression;
      return filteredQuery.push(condition);
    });
    return plugin.find({
      $or: filteredQuery
    }, function(error, data) {
      return response.json(data);
    });
  });

  ObjectId = mongoose.Types.ObjectId;

  backboneSchema = new Schema({
    title: String,
    body: String,
    _id: String
  }, {
    collection: "backbone"
  });

  backbone = mongoose.model("backbone", backboneSchema);

  schemas = {
    backbone: backbone
  };

  app.get("/plugin/:technology/:_id", function(request, response) {
    return schemas[request.params.technology].findOne(new ObjectId(request.params._id), function(error, data) {
      return response.send(data);
    });
  });

  app.listen(port, function() {
    return console.log("server is listening on port " + port);
  });

}).call(this);
