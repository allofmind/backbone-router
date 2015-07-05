express = require "express"
mongoose = require "mongoose"

app = express()
port = 3000

db = mongoose.connect "mongodb://localhost/site", server: poolSize: 1

app.use express.static __dirname + "/public", redirect: off

app.get "/", (request, response) ->
  response.sendFile "/public/index.html"

ObjectId = mongoose.Types.ObjectId

plugin = require("./controller/plugin")(db)
app.get /^\/plugin\/(backbone|jquery|angular)(?:\?find=(.*))?$/, (request, response) ->
  plugin.find request.query.find, request.params[0], (data) -> response.json data

article = require("./controller/article")(db)
app.get /^\/plugin\/(backbone|jquery|angular)?\/(\w+)$/, (request, response) ->
  article.get new ObjectId(request.params[1]), request.params[0], (data) -> response.json data

app.listen port, ->
  console.log "server is listening on port #{port}"