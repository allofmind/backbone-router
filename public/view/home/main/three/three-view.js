(function() {
  define(["text!./three-template.html"], function(twoTemplate) {
    var View;
    return View = Backbone.View.extend({
      className: "two",
      initialize: function(params) {
        return this.$el.html(twoTemplate);
      }
    });
  });

}).call(this);
