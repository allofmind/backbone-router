define [
  "text!./template.html"
], (
  template
) ->

  View = Backbone.View.extend
    className: "lvl-1"

    initialize: (params) ->
      @$el.html template