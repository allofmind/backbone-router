define [
  "text!./template.html"
], (
  template
) ->

  View = Backbone.View.extend

    className: "news-container clear"

    initialize: (params) ->
      @$el.html template