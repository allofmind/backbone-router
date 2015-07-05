(function() {
  module.exports = function(db) {
    var fields, models, schemas;
    schemas = {
      backbone: new db.Schema({
        title: String,
        description: String,
        articleId: String,
        _id: String
      }, {
        collection: "plugin"
      })
    };
    models = {
      backbone: db.model("plugin", schemas.backbone)
    };
    fields = ["title", "description"];
    return {
      find: function(find, collection, callback) {
        var expression, query;
        expression = new RegExp(find, "i");
        query = [];
        fields.forEach(function(field) {
          var condition;
          condition = {};
          condition[field] = expression;
          return query.push(condition);
        });
        return models[collection].find({
          $or: query
        }, function(error, data) {
          return callback(data);
        });
      }
    };
  };

}).call(this);
