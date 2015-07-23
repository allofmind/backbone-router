define [
  "text!./one-template.html"
], (
  oneTemplate
) ->

  View = Backbone.View.extend
    className: "one"

    initialize: (params) ->
      @$el.html oneTemplate