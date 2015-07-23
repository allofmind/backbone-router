(function() {
  define(function() {
    return {
      first: function(instance, done) {
        var animate, params;
        params = {
          opacity: 0
        };
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return instance.$el.css({
              opacity: params.opacity
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 0.6, {
          opacity: 1
        });
        return animate.play();
      },
      last: function(instance, done) {
        var animate, params;
        params = {
          opacity: 1
        };
        animate = new TimelineMax({
          paused: true,
          onUpdate: function() {
            return instance.$el.css({
              opacity: params.opacity
            });
          },
          onComplete: function() {
            return done();
          }
        });
        animate.to(params, 0.6, {
          opacity: 0
        });
        return animate.play();
      }
    };
  });

}).call(this);
