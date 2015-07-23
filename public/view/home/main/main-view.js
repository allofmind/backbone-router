(function() {
  define(["text!./main-template.html"], function(mainTemplate) {
    var View;
    return View = Backbone.View.extend({
      className: "main clear",
      initialize: function(params) {
        return this.$el.html(mainTemplate);
      }
    });
  });

}).call(this);
