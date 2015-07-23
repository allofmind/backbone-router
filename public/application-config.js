(function() {
  define(function() {
    return _.templateSettings.interpolate = /\{(.+?)\}/g;
  });

}).call(this);
