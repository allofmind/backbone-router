define [
  "text!./three-template.html"
], (
  twoTemplate
) ->

  View = Backbone.View.extend
    className: "two"

    initialize: (params) ->
      @$el.html twoTemplate