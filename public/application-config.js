(function() {
  define(function() {
    _.templateSettings.interpolate = /\{(.+?)\}/g;
    return TweenLite.ticker.fps(10);
  });

}).call(this);
