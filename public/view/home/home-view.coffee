define [
  "text!./home-template.html"
], (
  homeTemplate
) ->

  View = Backbone.View.extend
    className: "home"

    initialize: (params) ->
      @$el.html homeTemplate