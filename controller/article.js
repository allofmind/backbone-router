(function() {
  module.exports = function(db) {
    var models, schemas;
    schemas = {
      backbone: new db.Schema({
        title: String,
        body: String,
        _id: String
      }, {
        collection: "article"
      })
    };
    models = {
      backbone: db.model("article", schemas.backbone)
    };
    return {
      get: function(_id, collection, callback) {
        return models[collection].findOne(_id, function(error, data) {
          return callback(data);
        });
      }
    };
  };

}).call(this);
