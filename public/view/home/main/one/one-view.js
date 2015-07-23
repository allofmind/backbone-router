(function() {
  define(["text!./one-template.html"], function(oneTemplate) {
    var View;
    return View = Backbone.View.extend({
      className: "one",
      initialize: function(params) {
        return this.$el.html(oneTemplate);
      }
    });
  });

}).call(this);
