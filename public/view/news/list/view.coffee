define [
  "text!./template.html"
], (
  template
) ->

  View = Backbone.View.extend

    className: "news-list"

    initialize: (params) ->
      @$el.html template