define [
  "text!./template.html"
], (
  template
) ->

  View = Backbone.View.extend

    className: "welcome-container"

    initialize: (params) ->
      @$el.html template