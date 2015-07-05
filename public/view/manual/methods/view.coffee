define [
  "text!./template.html"
], (
  template
) ->

  View = Backbone.View.extend
    className: "lvl-2"

    initialize: ->
      @$el.html template