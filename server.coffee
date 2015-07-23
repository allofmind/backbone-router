express = require "express"
mongoose = require "mongoose"

app = express()
port = 3000

# db = mongoose.connect "mongodb://localhost/site", server: poolSize: 1

app.use express.static __dirname + "/public", redirect: off

app.get "/", (request, response) ->
  response.sendFile "/public/index.html"

app.listen port, ->
  console.log "server is listening on port #{port}"