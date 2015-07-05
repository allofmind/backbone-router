require.config
  paths:
    text: "lib/text"
    app: "app"

require [
  "app"
]

$.prototype.cloneElement = ($element) -> $(@[0].cloneNode())

_.templateSettings.interpolate = /\{(.+?)\}/g