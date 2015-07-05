(function() {
  define(["text!./template.html"], function(template) {
    var View;
    return View = Backbone.View.extend({
      className: "lvl-2",
      initialize: function() {
        return this.$el.html(template);
      }
    });
  });

}).call(this);
