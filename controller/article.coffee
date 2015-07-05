module.exports = (db) ->

  schemas =
    backbone: new db.Schema
      title: String
      body: String
      _id: String
    ,
      collection: "article"
  
  models =
    backbone: db.model "article", schemas.backbone

  get: (_id, collection, callback) ->
    models[collection].findOne _id, (error, data) -> callback data