module.exports = (db) ->
  
  schemas = 
    backbone: new db.Schema
      title: String
      description: String
      articleId: String
      _id: String
    ,
      collection: "plugin"
  
  models =
    backbone: db.model "plugin", schemas.backbone

  fields = [ "title", "description" ]

  find: (find, collection, callback) ->
    expression = new RegExp find, "i"
    query = [ ]
    fields.forEach (field) ->
      condition = { }
      condition[field] = expression
      query.push condition
    models[collection].find $or: query, (error, data) -> callback data