(function() {
  define(["text!./two-template.html"], function(twoTemplate) {
    var View;
    return View = Backbone.View.extend({
      className: "two",
      initialize: function(params) {
        return this.$el.html(twoTemplate);
      }
    });
  });

}).call(this);
