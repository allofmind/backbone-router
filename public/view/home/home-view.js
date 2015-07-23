(function() {
  define(["text!./home-template.html"], function(homeTemplate) {
    var View;
    return View = Backbone.View.extend({
      className: "home",
      initialize: function(params) {
        return this.$el.html(homeTemplate);
      }
    });
  });

}).call(this);
