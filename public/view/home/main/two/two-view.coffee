define [
  "text!./two-template.html"
], (
  twoTemplate
) ->

  View = Backbone.View.extend
    className: "two"

    initialize: (params) ->
      @$el.html twoTemplate