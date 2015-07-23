define [
  "text!./main-template.html"
], (
  mainTemplate
) ->

  View = Backbone.View.extend
    className: "main clear"

    initialize: (params) ->
      @$el.html mainTemplate