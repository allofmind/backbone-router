(function() {
  define(["text!./template.html"], function(template) {
    var View;
    return View = Backbone.View.extend({
      className: "welcome-container",
      initialize: function(params) {
        return this.$el.html(template);
      }
    });
  });

}).call(this);
